---
title: "イベントの発行を同期的に待機"
date: "2022-07-09"
---

イベントの発行を同期的に待機する方法についてメモ。

## 自分が発行したトランザクションの場合

これはドキュメントに書いてある通り。

```java
const tx = await contract.doSomthing();
await tx.wait();
afterDo();
```

## oracle とか他の誰かが発行したトランザクションによって、イベントが発行された場合

Chainlink VRF にて[`requestRandomWords`](https://docs.chain.link/docs/get-a-random-number/#request-random-values)を呼び出したあとに、VRF Coordinator が`fulfillRandomWords`を呼び出してくれまで待機したいケース。

```java
await new Promise(async (resolve) => {
  contract.once("FulfillRandomWords", async () => resolve(0));
  const tx = await contract.requestRandomWrods();
  await tx.wait();
});

afterDo();
```

こんな感じでイベントの発行までブロックする。

`fulfillRandomWords`の中でイベントを発行するのを忘れないように。

ここでは`FulfillRandomWords`というイベントを待機している。
