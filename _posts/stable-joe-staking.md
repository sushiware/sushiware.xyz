---
title: "StableJoeStakingコントラクトのメモ"
date: "2022-06-26"
---

StableJoeStaking コントラクトを読んだのでメモ。

<https://github.com/traderjoe-xyz/joe-core/blob/main/contracts/StableJoeStaking.sol>

## updateReward

```java
/**
	* @notice Update reward variables
	* @param _token The address of the reward token
	* @dev Needs to be called before any deposit or withdrawal
	*/
function updateReward(IERC20Upgradeable _token) public {
		require(isRewardToken[_token], "StableJoeStaking: wrong reward token");

		uint256 _totalJoe = internalJoeBalance;

		uint256 _currRewardBalance = _token.balanceOf(address(this));
		uint256 _rewardBalance = _token == joe ? _currRewardBalance.sub(_totalJoe) : _currRewardBalance;

		// Did StableJoeStaking receive any token
		if (_rewardBalance == lastRewardBalance[_token] || _totalJoe == 0) {
				return;
		}

		uint256 _accruedReward = _rewardBalance.sub(lastRewardBalance[_token]);

		accRewardPerShare[_token] = accRewardPerShare[_token].add(
				_accruedReward.mul(ACC_REWARD_PER_SHARE_PRECISION).div(_totalJoe)
		);
		lastRewardBalance[_token] = _rewardBalance;
}
```

最も重要なメソッド。

`deposit`、`withdraw`の際に必ず呼ばれる。

reward が振り込まれていないと以下の箇所以降は実行されない。

```java
// Did StableJoeStaking receive any token
if (_rewardBalance == lastRewardBalance[_token] || _totalJoe == 0) {
		return;
}
```

`_rewardBalance > lastRewardBalance[_token]`となるのは

運営が`StableJoeStaking`コントラクトにトークンを transfer した直後のみである。

それ以外の処理は一般的な StakingRewards コントラクトとほぼ、変わらない。

`claimReward`のようなメソッドはなく、`withdraw(0)`で報酬だけを受け取れる。

このコントラクトが良いのは、途中まではバッチ処理等で reward 用の token を transfer し、

準備ができたら、フルオンチェーンに切り替えるというのが容易な点だと思う。

Joe では特にそんなことしてはいない。

Joe のコードは読みやすいし、網羅性も高い。

全部読んでいこうと思う。
