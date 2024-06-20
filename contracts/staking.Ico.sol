// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "./staking.sol";

contract Stake {
    address payable public owner;
    uint256 public REWARD_RATE = 15;
    ERC20 public token;
    uint256 public totalReward;

    uint256 public constant MIN_STAKE_PERIOD = 1 seconds;

    uint256 public constant BASE_RATE = 1150; // 11.5%
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public lastStakeTime;

    constructor(address _tokenAddress) {
        owner = payable(msg.sender);
        token = ERC20(_tokenAddress);
    }

    // Function to transfer tokens to another account
    function transferTokens(address recipient, uint256 amount) public {
        require(msg.sender == owner, "Only the owner can transfer tokens");
        require(token.transfer(recipient, amount), "Token transfer failed");
    }

    function stake() external payable {
        stakedAmount[msg.sender] += msg.value;
        lastStakeTime[msg.sender] = block.timestamp;
    }

    function unstake(uint256 _unstakeAmount) external {
        require(stakedAmount[msg.sender] > 0);
        (bool callsuccess, ) = payable(msg.sender).call{value: _unstakeAmount}(
            ""
        );
        require(callsuccess, "call is failed");
    }

    function getReward() external view returns (uint256) {
        require(stakedAmount[msg.sender] > 0, "No staked amount");
        uint256 stakedTime = block.timestamp - lastStakeTime[msg.sender];
        require(stakedTime >= MIN_STAKE_PERIOD, "Staking period not reached");

        uint256 rewardRatePerDay = (BASE_RATE * 1e18) / MIN_STAKE_PERIOD;
        uint256 reward = ((stakedAmount[msg.sender] * rewardRatePerDay) /
            1e18) * (stakedTime / 1 days);
        return reward;
    }


}
