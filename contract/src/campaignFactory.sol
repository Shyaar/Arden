// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Campaign} from "./campaign.sol";
import {UserRegistry} from "./usersRegistry.sol";
import {Events} from "./lib/events/factoryEvents.sol";
import {Errors} from "./lib/errors/factoryErrors.sol";

contract CampaignFactory is Ownable {
    UserRegistry public userRegistry;
    address[] public allCampaigns;
    mapping(address => address[]) public campaignsByOwner;
    mapping(address => bool) public isCampaignAddress;
    bool public paused;

    event TaskCompleted(address indexed user, address indexed campaign, uint256 indexed taskId);

    modifier whenNotPaused() {
        if (paused) revert Errors.Factory_Paused();
        _;
    }

    constructor(address _userRegistryAddress) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistryAddress);
    }

    // ================== Campaign Creation ==================

    function createCampaign(
        string memory _campaignName,
        string memory _dappLink,
        uint256 _endTime,
        uint256 _budget
    ) external payable whenNotPaused {
        UserRegistry.User memory user = userRegistry.getUser(msg.sender);
        if (!user.isVerified || user.role != UserRegistry.Role.PRODUCTOWNER) {
            revert Errors.Factory_NotVerifiedProductOwner();
        }

        Campaign newCampaign = new Campaign(
            msg.sender,
            _campaignName,
            _dappLink,
            _budget,
            _endTime
        );

        if (msg.value > 0) {
            newCampaign.increaseBudget{value: msg.value}();
        }

        address campaignAddress = address(newCampaign);
        allCampaigns.push(campaignAddress);
        campaignsByOwner[msg.sender].push(campaignAddress);
        isCampaignAddress[campaignAddress] = true;

        emit Events.CampaignCreated(msg.sender, campaignAddress, block.timestamp);
    }

    // ================== Reward Distribution ==================

    function verifyAndRewardUser(
        address payable _campaignAddress,
        address _user,
        uint256 _taskId
    ) external onlyOwner {
        if (_campaignAddress == address(0) || !isCampaignAddress[_campaignAddress]) {
            revert Errors.Factory_InvalidCampaignAddress();
        }

        Campaign campaign = Campaign(_campaignAddress);
        campaign.rewardUser(_user, _taskId);

        emit TaskCompleted(_user, _campaignAddress, _taskId);
    }

    // ================== View Functions ==================

    function getAllCampaigns() external view returns (address[] memory) {
        return allCampaigns;
    }

    function getCampaignsByOwner(address _owner) external view returns (address[] memory) {
        return campaignsByOwner[_owner];
    }

    function isCampaign(address _campaignAddress) external view returns (bool) {
        return isCampaignAddress[_campaignAddress];
    }

    // ===== Forwarded View Functions from Campaign =====

    function getTask(
        address payable _campaign,
        uint256 _taskId
    ) external view returns (Campaign.Task memory) {
        return Campaign(_campaign).getTask(_taskId);
    }

    function getTaskCount(address payable _campaign) external view returns (uint256) {
        return Campaign(_campaign).getTaskCount();
    }

    function hasUserCompletedTask(
        address payable _campaign,
        address _user,
        uint256 _taskId
    ) external view returns (bool) {
        return Campaign(_campaign).hasUserCompletedTask(_user, _taskId);
    }

    function getCampaignDetails(
        address payable _campaign
    )
        external
        view
        returns (
            string memory name,
            string memory link,
            uint256 total,
            uint256 remaining,
            uint256 reserved,
            uint256 endTime,
            bool active
        )
    {
        return Campaign(_campaign).getCampaignDetails();
    }

    // ================== Admin Functions ==================

    function togglePause() external onlyOwner {
        paused = !paused;
        emit Events.PausedStateChanged(paused);
    }

    function setUserRegistry(address _newUserRegistryAddress) external onlyOwner {
        userRegistry = UserRegistry(_newUserRegistryAddress);
    }
}
