// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

event BudgetIncreased(uint256 amount, uint256 newTotal);
event TaskCreated(uint256 indexed taskId, string title, uint256 reward);
event TaskToggled(uint256 indexed taskId, bool status);
event CampaignToggled(bool status);
event RewardDistributed(
    address indexed user,
    uint256 indexed taskId,
    uint256 amount
);
event FundsWithdrawn(address indexed owner, uint256 amount);
