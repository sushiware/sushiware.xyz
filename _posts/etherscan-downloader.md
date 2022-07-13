---
title: "etherscanからコードをダウンロードするスクリプトを書いた"
date: "2022-07-13"
---

コントラクトのコードが Github になく、etherscan で見るしかない場合が結構ある。

これはかなり見にくいので、手元に簡単にダウンロードしてくるツールをスクリプトを書いた。

## [etherscan-downloader](https://github.com/nasjp/etherscan-downloader/)

対して褒められたようなコードではないが、結構重宝しているので紹介。

clone してきたらまず、`config.json`を修正する。

```json
{
  "target": "v1punks",        <= "contracts"でchainとaddressに名前をつけているのでそれを指定
  "contractDir": "contracts", <= 出力先のdir名
  "contracts": {
    ...
    "v1punks": {
      "chain": 1,
      "address": "0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d"
    },
    ...
  }
}
```

次に etherscan の API キーを環境変数に追加

```bash
export ETHERSCAN_APIKEY=KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
```

最後にコードを実行

```bash
npm ci
go mod download
go run .
```

openzeppelin に依存しているコードは非常に多いため、定義ジャンプ用にな`npm ci`しておく。

完了すると下記のような感じでダウンロードできる。

```bash
$ tree contracts
contracts
└── cryp_toadz
    ├── @openzeppelin
    │   └── contracts
    │       ├── access
    │       │   └── Ownable.sol
    │       ├── introspection
    │       │   ├── ERC165.sol
    │       │   └── IERC165.sol
    │       ├── math
    │       │   └── SafeMath.sol
    │       ├── payment
    │       │   └── PaymentSplitter.sol
    │       ├── token
    │       │   └── ERC721
    │       │       ├── ERC721.sol
    │       │       ├── IERC721.sol
    │       │       ├── IERC721Enumerable.sol
    │       │       ├── IERC721Metadata.sol
    │       │       └── IERC721Receiver.sol
    │       └── utils
    │           ├── Address.sol
    │           ├── Context.sol
    │           ├── EnumerableMap.sol
    │           ├── EnumerableSet.sol
    │           └── Strings.sol
    └── contracts
        └── Toadz.sol
```

シングルファイルもマルチファイルもどちらも対応している。

VSCode で読めて最高。

## dependencies

```bash
$ node -v
v14.19.1
$ npm -v
8.6.0
$ go version
go version go1.18.1 darwin/arm64
```
