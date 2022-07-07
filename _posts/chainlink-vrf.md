---
title: "Chainlink VRFで乱数を生成する"
date: "2022-07-07"
---

乱数生成に必要不可欠な Oracle の最大手 Chainlink の Random Number generator の使い方についてメモ。

## Chainlink VRF を使う方法

Chainlink VRF は

1. [Subscription Manager](https://vrf.chain.link/)で Subscription を作成する(Subscription)
2. 一定額の`LINK`をデポジットしておく
3. [VRFConsumerBaseV2.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBaseV2.sol)を実装したコントラクトをデプロイ
4. cosumer としてコントラクトを設定
5. コントラクトから VRF Coordinator に作成した Subscription の ID を指定して乱数の生成を依頼(`requestRandomWords`)する
6. 非同期でコントラクトで実装する必要があった`fulfillRandomWords`が VRF Coordinator に呼び出される。

という流れで使用する。

コントラクトから Subscription を作ることもできるが、コントラクトを作成する前に作っておいて、`LINK`を貯めておけば、そこらへんのハンドリングがいらなくなる。

## コントラクトの実装

[VRFConsumerBaseV2.sol](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBaseV2.sol)を継承したコントラクトを実装する必要がある。

`VRFConsumerBaseV2`はこんな感じの実装になっている。

```java
abstract contract VRFConsumerBaseV2 {
  address private immutable vrfCoordinator;
  constructor(address _vrfCoordinator) {
    vrfCoordinator = _vrfCoordinator;
  }

  function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;

  function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external {
    if (msg.sender != vrfCoordinator) {
      revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
    }
    fulfillRandomWords(requestId, randomWords);
  }
}
```

`rawFulfillRandomWords`が VRF Coordinator から呼び出され、その中で`fulfillRandomWords`が呼ばれる。

`rawFulfillRandomWords`を呼び出してもらうためには VRF Coordinator コントラクトの`requestRandomWords`を呼び出す必要がある。

```java
uint256 requestId = VRFCoordinatorV2Interface(_VRF_COORDINATOR_V2).requestRandomWords(
  keyHash, // bytes32
  subscriptionId, // uint64 subId,
  minimumRequestConfirmations, // uint16
  callbackGasLimit, // uint32
  numWords // uint32
);
```

- keyHash: 支払ってもよいガス料金の上限。 ガス価格が上限を下回るまで実行されない。
- minimumRequestConfirmations: Chainlink VRF が応答するまでの確認ブロックの最小数。これが大きいほど、安全だが遅くなる。
- callbackGasLimit: VRF Coordinator が fulfillRandomWords を呼び出すときのガスリミット。これよりも多くかかると失敗する。
- numWords: VRF Coordinator が生成してくれる。

[Configurations](https://docs.chain.link/docs/vrf-contracts/#ethereum-mainnet)に、keyHash がまとまっている。

callbackGasLimit は[ここ](https://docs.chain.link/docs/chainlink-vrf/#subscription-billing)によると、一般的に、100,000 ガスの上限が適切らしい。
