---
title: "ロックアップしたトークンを線形にリリースするコントラクトを作る"
date: "2022-06-02"
---

ERC20 ベースで作成したトークンを投資家や運営に対してロックアップし、時間推移と共に線形にリリースしていくコントラクトを作りたい。

## TokenTimeLock.sol

[TokenTimelock - OpenZeppelin Docs](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20#TokenTimelock)

まず、ただ、一定時間ロックアップするコントラクトを参考にする

```java
function release() public virtual {
    require(block.timestamp >= releaseTime(), "TokenTimelock: current time is before release time");

    uint256 amount = token().balanceOf(address(this));
    require(amount > 0, "TokenTimelock: no tokens to release");

    token().safeTransfer(beneficiary(), amount);
}
```

このコントラクトは`beneficiary`は単一、`releaseTime`はトークンをロックアップする時間を表す。

これを拡張していく。

## 線形にリリースしていく方法

下記の変数を用意する

- `beneficiary`
  - 投資家や運営
- `total`
  - `beneficiary`が最終的に受け取るトークンの量
  - `beneficiary`ごとに設定する
- `releaseStartTime`
  - トークンのリリースを開始する時間
  - トークンの`releaseFinishTime`まで毎秒、定額でトークンをリリースしていく。
- `releaseFinishTime`
  - トークンのリリースが終了する時間

`beneficiary`は`block.timestamp`時刻に下記の量のトークンを受けとれる

```java
uint256 vested = amount * (block.timestamp - releaseStartTime) / (releaseFinishTime - releaseStartTime);
```

$$
T = total
$$

$$
t = block.timestamp
$$

$$
rst = releaseStartTime
$$

$$
rft = releaseFinishTime
$$

$$
V(t) = T\frac{t - fst}{rft - rst}
$$

これを使って、`block.timestamp`が進むたびに(1 秒ごとに)トークンをリリースできる。

すでにリリースされた分は除外したいので、

```java
uint256 vested = total * (block.timestamp - releaseStartTime) / (releaseFinishTime - releaseStartTime);

uint256 transferable = vested - alreadyTransfered;
```

`uint256`なので、先に`total * (block.timestamp - releaseStartTime)`を計算しておく。

## TokneLinerTimeLock.sol

下記が全コード。 DYOR。

`finaliseReleaseTime`で`releaseStartTime`と`releaseFinishTime`を設定する。

`depositToken`で`beneficiary`に`amount`をロックアップする。

`finaliseDeposit`でデポジットを確定させる。

`release`メソッドで、`beneficiary`へトークンをリリースする。

```java
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "forge-std/console.sol";

contract TokenLinearTimelock is Ownable {
    using SafeERC20 for IERC20;

    address public token;

    bool public isDepositFinalised;

    bool public isReleaseTimeFinalised;
    uint256 public releaseStartTime;
    uint256 public releaseFinishTime;

    mapping(address => uint256) public alreadyTransfered;
    mapping(address => uint256) public balances;

    event TokensDeposited(address from, uint256 amount);
    event AllocationPerformed(address beneficiary, uint256 amount);
    event TokensUnlocked(address beneficiary, uint256 amount);

    constructor(address _token) {
        require(_token != address(0), "token address can not be zero");
        token = _token;
    }

    modifier notDepositFinalised() {
        require(!isDepositFinalised, "deposit have been finalised");
        _;
    }

    modifier notReleaseTimeFinalised() {
        require(releaseStartTime == 0, "Release time has already been set");
        _;
    }

    modifier releaseTimeFinalised() {
        require(releaseStartTime != 0, "Release time has not been set yet");
        _;
    }

    function finaliseDeposit()
        public
        onlyOwner
        releaseTimeFinalised
        notDepositFinalised
    {
        isDepositFinalised = true;
    }

    function finaliseReleaseTime(
        uint256 _periodUntilReleaseStartTime,
        uint256 _periodUntilReleaseFinishTime
    ) public onlyOwner notReleaseTimeFinalised {
        require(
            _periodUntilReleaseStartTime > 0,
            "The period until release start time must be greater than zero"
        );

        require(
            _periodUntilReleaseFinishTime > 0,
            "The period until release finish time must be greater than zero"
        );

        require(
            _periodUntilReleaseFinishTime > _periodUntilReleaseStartTime,
            "The period until release finish time must be greater than the period until release start time"
        );

        releaseStartTime = block.timestamp + _periodUntilReleaseStartTime;
        releaseFinishTime = block.timestamp + _periodUntilReleaseFinishTime;
    }

    function depositToken(address beneficiary, uint256 amount)
        public
        onlyOwner
        releaseTimeFinalised
        notDepositFinalised
    {
        _depositToken(beneficiary, amount);
    }

    function bulkDepositTokens(
        address[] calldata beneficiaries,
        uint256[] calldata amounts
    ) public onlyOwner releaseTimeFinalised notDepositFinalised {
        require(
            beneficiaries.length == amounts.length,
            "The recipients and amounts arrays must be the same size in length"
        );

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            _depositToken(beneficiaries[i], amounts[i]);
        }
    }

    function _depositToken(address beneficiary, uint256 amount) private {
        require(
            amount >= (releaseFinishTime - releaseStartTime),
            "Amount deposited must be greater than release period"
        );

        require(
            beneficiary != address(0),
            "Beneficiary address can not be zero"
        );

        balances[beneficiary] += amount;

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        emit AllocationPerformed(beneficiary, amount);
    }

    function release(uint256 amount) public releaseTimeFinalised {
        require(
            balances[msg.sender] >= amount,
            "Insufficient token balance, try lesser amount"
        );

        require(
            block.timestamp > releaseStartTime,
            "Tokens are only available after correct time period has elapsed"
        );

        uint256 available = transferableAmount(msg.sender);

        require(
            available >= amount,
            "Token amount not available for unlock right now, please try lesser amount"
        );

        alreadyTransfered[msg.sender] += amount;
        balances[msg.sender] -= amount;

        IERC20(token).safeTransfer(msg.sender, amount);

        emit TokensUnlocked(msg.sender, amount);
    }

    function transferableAmount(address beneficiary)
        public
        view
        releaseTimeFinalised
        returns (uint256)
    {
        if (block.timestamp > releaseFinishTime) {
            return balances[beneficiary];
        }

        if (releaseStartTime > block.timestamp) {
            return 0;
        }

        uint256 total = alreadyTransfered[beneficiary] + balances[beneficiary];

        uint256 vested = (total * (block.timestamp - releaseStartTime)) /
            (releaseFinishTime - releaseStartTime);

        return vested - alreadyTransfered[beneficiary];
    }
}
```

いいね $\KaTeX$

全然書き方わからんね $\KaTeX$
