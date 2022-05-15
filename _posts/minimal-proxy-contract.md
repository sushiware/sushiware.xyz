---
title: "Minimal Proxy Contract について"
date: "2022-05-16"
---

Minimal Proxy Contract について調べたのでメモ

## Minimal Proxy Contract とは

ERC1167 で定義されている、コントラクトを安価に複製する実装パターン

[EIP-1167: Minimal Proxy Contract
](https://eips.ethereum.org/EIPS/eip-1167)

ユーザーごとに同一のコントラクトをデプロイする必要がある場合にガス代を抑えることができる。

ただ、複製したコントラクト を呼び出す際は、少しガス代が増える。
