// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library Errors {
    error Factory_Paused();
    error Factory_NotVerifiedProductOwner();
    error Factory_InvalidCampaignAddress();
    error Factory_InvalidFee();
}