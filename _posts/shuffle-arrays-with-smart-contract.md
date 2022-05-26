---
title: "Smart Contractで配列をシャッフルする"
date: "2022-05-26"
---

安全な乱数を使用して配列をシャッフルするためには Chainlink VRF 等の Oracle を使用するしかないが、今回は安全である必要がない乱数で十分なので実装方法を考えた。

## 今回のユースケース

ERC721 を実装するコントラクトの一つのトークンに対して一つの番号を付与したい。(luckyNumber)

tokenId が 0 から 999 までだとすると 0 から 999 までの数値を ランダムに luckyNumber として割り振っていく。

```txt
例:
    tokenId: 991, luckyNumber: 930
    tokenId: 12, luckyNumber: 404
    tokenId: 267, luckyNumber: 876
```

1. 1 から 1000 までの数値を配列に格納
2. それをシャッフルする。
3. tokenId でインデックスアクセスすれば、luckyNumber が取得できる。

必要になる配列をシャッフルする方法を考える。

## Fisher-Yates shuffle

ランダムシャッフルのアルゴリズムには、[Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)を使用する。

```java
function _fisherYatesShuffleLuckyNumbers() internal {
    bytes32 salt = keccak256(abi.encodePacked(block.timestamp));
    uint256 length = _luckyNumbers.length;
    for (uint256 i = length - 1; i > 0; i--) {
        salt = keccak256(abi.encodePacked(salt));
        uint256 j = uint256(salt) % i;
        uint256 temp = _luckyNumbers[i];
        _luckyNumbers[i] = _luckyNumbers[j];
        _luckyNumbers[j] = temp;
    }
}
```

`i` は `length - 1` から `1` までデクリメントされ、`j` は `0` 以上 `i` 以下の整数である。

`_luckyNumbers[i]` と `_luckyNumbers[j]`を交換する。

そのため、入れ替えられた要素が 2 回以上入れ替わることはない。

これによって、理論上偏りがない結果が得られる。

`salt` の生成が一回分無駄に行われているのはご愛嬌。

全体はこちら

```java
import {ERC721A} from "ERC721A/contracts/ERC721A.sol";

contract AwesomeNFT is ERC721A {
    uint256 public constant MAX_SUPPLY = 1000;

    uint256[] _luckyNumbers;

    address public constant VALUTS = 0x0000000000200020000000200000000200000000;

    constructor() ERC721A("AwesomeNFT", "AN") {
        _safeMint(VALUTS, MAX_SUPPLY);
        _initLuckyNumbers(MAX_SUPPLY);
    }

    function getLuckyNumber(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return _luckyNumbers[tokenId];
    }

    function _initLuckyNumbers(uint256 quantity) internal {
        _luckyNumbers = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            _luckyNumbers[i] = i;
        }
        _fisherYatesShuffleLuckyNumbers();
    }

    function _fisherYatesShuffleLuckyNumbers() internal {
        uint256 salt = uint256(keccak256(abi.encodePacked(block.timestamp)));
        uint256 length = _luckyNumbers.length;
        for (uint256 i = length - 1; i > 0; i--) {
            uint256 j = salt % i;
            uint256 temp = _luckyNumbers[i];
            _luckyNumbers[i] = _luckyNumbers[j];
            _luckyNumbers[j] = temp;
        }
    }
}
```

いいかんじ。
