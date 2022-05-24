---
title: "Minimal Proxy Contract について"
date: "2022-05-16"
---

Minimal Proxy Contract について調べたのでメモ

## Minimal Proxy Contract とは

ERC1167 で定義されている、コントラクトを安価に複製する実装パターン

[EIP-1167: Minimal Proxy Contract
](https://eips.ethereum.org/EIPS/eip-1167)

何も考えず、コントラクトを複製するとなるとメソッド内で`new`するだけであるが、

これだと、ガス代がかかりすぎる

```java
function clone() public {
    new Sample();
}
```

そうではなく、ロジックをまるっと記述しておく Logic コントラクトと、

そのロジックを参照し、データをストアするだけの Proxy コントラクトを複製していく Factory コントラクトを作る。

複製対象のコントラクトは中身がすっからかんなので、デプロイも安価に済む。

## やり方

### 1. Logic コントラクトを実装する

このコントラクトはロジックだけを持つので、変数に値をセットしたり、それを読んだりすることはできない。

このようなロジックだけを保存しておくコントラクトは一般的な`Initializers`を使用する

[Initializers](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers)

ドキュメントでは、Upgradable なコントラクトを記述するための道具として説明されているが、Proxy コントラクトを作るためにも使える。

コントラクトの初期化には`constructor`を使用するが、

Proxy からそれを呼び出すみたいなことはできないので、

代わりとなる`initialize`メソッドを用意する

```java
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract LogicContract is Initializable {
    function initialize(uint256 _x) public initializer {
        x = _x;
    }
}
```

コントラクトを複製する際にこのメソッドを呼び出すことで初期化できるようになる。

このメソッドは一度しか呼び出すことができない。

そのため、攻撃者はこのメソッドを呼び出すことができない。

これ以外は普通にコントラクトのロジックを実装していく。

## 2. Factory コントラクトを実装する

Factory のコントラクトも、至ってシンプル。

1. `Clones`ライブラリを`address`に`using`する
2. Logic コントラクトのアドレスから`clone`する
3. `clone`したコントラクトを`initialize`する

```java
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract LogicContractFactory {
    using Clones for address; // 1

    address public implementation;

    constructor(_implementation) public {
          implementation = _implementation;
    }

    function clone() public returns (address) {
        bytes memory data = _encode(4649);
        bytes32 salt = keccak256(abi.encodePacked(data));
        address deployedProxy = implementation.cloneDeterministic(salt); // 2
        deployedProxy.functionCall(data); // 3
        return deployedProxy;
    }

    function _encode(uint256 x) internal pure returns (bytes memory) {
        return
            abi.encodeWithSignature(
                "initialize(uint256)",
                x,
            );
    }
}
```

`Clones`ライブラリを`address`に`using`することで、`cloneDeterministic`メソッドを使用することができるようになる。

`cloneDeterministic`アドレスのロジックを呼び出す`Proxy`コントラクトをデプロイしてくれる。

渡した`salt`を元に決定論的にアドレスを生成する。

あとは普通のコントラクトのようにメソッドを呼び出してやれば良いだけ。

```java
function do() {
    address proxy = factory.clone();
    ILogic(proxy).do();
}
```

非常に便利。
