---
title: "hardhatのテスト力を向上させるtips"
date: "2022-06-03"
---

solidity のコードをまともに書くには、自動テストの習熟こそが最重要なポイントの一つではないかと思っている。

そのため、関連のドキュメントを読んで、ためになったものをメモる。

## Fixtures - waffle

[Fixtures - waffle](https://ethereum-waffle.readthedocs.io/en/latest/fixtures.html)

nouns とかクソほどに有名なプロジェクトでも使っていない。

ブロックチェーンのスナップショットを取得して、再利用してくれる。

なので、これを使って、コントラクトをデプロイするだけで、テストを高速化できるし、コードがスッキリする。

## dynamically generating tests - mocha

[dynamically generating tests - mocha](https://mochajs.org/#dynamically-generating-tests)

js の forEach を使って、Go の table driven test のように記述することができる。

可読性がめちゃくちゃ上がるので、積極的に使っていくのが良いと思う。

## nouns util

[utils.ts - nounsDAO/nouns-monorepo](https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/test/utils.ts)

自分のプロジェクトにも流用できる便利コードが並んでいる。

見た中でも、ずば抜けて読みやすく、有用性も高いのでめちゃくちゃオススメ。

## time-based tests

[Time-based tests - waffle](https://ethereum-waffle.readthedocs.io/en/latest/migration-guides.html?highlight=timestamp#time-based-tests)

timestamp を早送りして実行したいテストを書くときに使える。

```typescript
export const setNextBlockTimestamp = async (
  n: number,
  mine = true
): Promise<void> => {
  await rpc({ method: "evm_setNextBlockTimestamp", params: [n] });
  if (mine) await mineBlock();
};
```

あと、block.number、 block.timestamp は下記のような utils を書いておくと便利

```typescript
export const blockNumber = async (parse = true): Promise<number> => {
  const result = await rpc<number>({ method: "eth_blockNumber" });
  return parse ? parseInt(result.toString()) : result;
};

export const blockTimestamp = async (
  n: number | string,
  parse = true
): Promise<number | string> => {
  const block = await blockByNumber(n);
  return parse ? parseInt(block.timestamp.toString()) : block.timestamp;
};
```

これを使ってこんな感じ

```typescript
await setNextBlockTimestamp(Number(await blockTimestamp("latest")) + DURATION);
```

## private method tests

[ERC20Mock.sol - OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/mocks/ERC20Mock.sol)

private や internal のメソッドはテストできない。

なので、本当にテストしたい場合は、そのまま公開する public なメソッドを実装した Mock コントラクトを使うこと。

## should behave like

[shouldBehaveLikeERC20 - OpenZeppelin/openzeppelin-contracts](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/test/token/ERC20/ERC20.behavior.js#L5-L189)

テストケースを固めて表現したいときはこのように関数を定義してそれを呼び出す形にする。

RSpec の it_behaves_like に近いと思う。なので、名前は何でも良い。

## OpenZeppelin Test Helpers

[Test Helpers - OpenZeppelin Docs](https://docs.openzeppelin.com/test-helpers/0.5/)

`expectRevert`だけでも相当便利

```typescript
await expectRevert(
  this.erc20.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }),
  "ERC20: transfer to the zero address"
);
```

インストールはこちら

[hardhat-web3](https://hardhat.org/plugins/nomiclabs-hardhat-web3#installation)

(ちなみに、まだ使ったことはない。今度使う)

## Moloch Testing Guide

[moloch/test](https://github.com/MolochVentures/moloch/tree/master/test)

solidity のテスティングガイドとしては最も有用だと思う。

必読

---

以上。

新しいのを随時更新する
