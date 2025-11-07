// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library Events {
    event CampaignCreated(
        address indexed owner,
        address indexed campaignAddress,
        uint256 timestamp
    );
    event PausedStateChanged(bool isPaused);
}
