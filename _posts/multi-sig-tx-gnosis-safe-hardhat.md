---
title: "safe-core-sdkを使用してSafe Wallet用のマルチシグトランザクションをhardhat taskで発行したい"
date: "2022-06-25"
---

Gnosis Safe を使う際、Web のインターフェイスだけで事足りることは少ない。

エンジニアのオーナーアドレスから マルチシグトランザクションを発行し、非エンジニアが Web インターフェイスから 署名するユースケースは結構あるので、メモ。

hardhat の task から実行することを想定。

## 0. 依存パッケージをインストール

safe-core-sdk を使用する。

https://github.com/safe-global/safe-core-sdk

```sh
npm install -D \
  @gnosis.pm/safe-core-sdk \
  @gnosis.pm/safe-ethers-lib \
  @gnosis.pm/safe-service-client
```

## 1. 生のトランザクションを作成する。

hardhat にはいつも使わないが、生のトランザクションを生成するメソッド`populateTransaction`がある。

```typescript
const factory = await hre.ethers.getContractFactory("Hoge");
const hoge = ndtFactory.attach(hogeAddress); // コントラクトはデプロイ済みを想定
const unsignedTx = hoge.populateTransaction["doSomething"]();
const data = (await unsignedTx).data || "";
```

## 2. Gnosis Safe 関連の必要なインスタンスを生成

主に必要なインスタンスは

- `Safe`コントラクトのインスタンス
  - Gnosis Safe 用のトランザクションを生成、署名する
- SafeServiceClient のインスタンス(これで)
  - マルチシグトランザクションを発行する

SafeServiceClient のエンドポイントは下記

https://safe-docs.dev.gnosisdev.com/safe/docs/tutorial_tx_service_initiate_sign/

```typescript
import Safe from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";

~~~

const ethers = hre.ethers;

const [signer] = await hre.ethers.getSigners(); // マルチシグトランザクションを出したいエンジニアのアドレス

const ethAdapter = new EthersAdapter({ ethers, signer });

const safeAddress = "0x??..."; //　チームの Safe Wallet のコントラクトアドレス

const safe = await Safe.create({ ethAdapter, safeAddress });

const txServiceUrl = "https://safe-transaction.mainnet.gnosis.io/"

const safeServiceClient = new SafeServiceClient({ txServiceUrl, ethAdapter });
```

## 2. マルチシグトランザクションを発行する

トランザクションをただ生成するだけではダメで、署名してから、提案する必要がある。

1. Safe トランザクションを作成
2. 署名
3. 署名を Safe トランザクションに追加
4. マルチシグトランザクションを発行

```typescript
const safeTransaction = await safe.createTransaction(transaction); // Safeトランザクションを生成

const safeTxHash = await safe.getTransactionHash(safeTransaction);

const signature = await safe.signTransactionHash(safeTxHash); // トランザクションに署名

safeTransaction.addSignature(signature); // 署名をSafeトランザクションに追加

const safeAddress = safe.getAddress();

const senderAddress = await safe.getEthAdapter().getSignerAddress();

// マルチシグトランザクションを発行する
await safeServiceClient.proposeTransaction({
  safeAddress,
  safeTransaction,
  safeTxHash,
  senderAddress,
});
```

## 3. web UI から非エンジニアが confirm

Transaction の Queue に追加されるので、confirm か reject してもらう

---

これで、定期的に Safe Wallet で実行する必要がある処理とかを hardhat task にしておける。

マルチシグトランザクションを confirm したり、threshold に達した owner なら実行することも可能。

だが、Safe Wallet を金庫として使用しているだけであれば、これで十分。
