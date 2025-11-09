// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Campaign} from "./campaign.sol";
import {UserRegistry} from "./usersRegistry.sol";
import {Events} from "./lib/events.sol";
import {Errors} from "./lib/errors.sol";

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

    function createCampaign(
        string memory _campaignName,
        string memory _dappLink,
        uint256 _endTime
    ) external payable whenNotPaused {
        UserRegistry.User memory user = userRegistry.getUser(msg.sender);
        if (!user.isVerified || user.role != UserRegistry.Role.PRODUCTOWNER) {
            revert Errors.Factory_NotVerifiedProductOwner();
        }

        Campaign newCampaign = new Campaign(
            msg.sender,
            _campaignName,
            _dappLink,
            _endTime
        );

        if (msg.value > 0) {
            newCampaign.increaseBudget{value: msg.value}();
        }

        address campaignAddress = address(newCampaign);
        allCampaigns.push(campaignAddress);
        campaignsByOwner[msg.sender].push(campaignAddress);
        isCampaignAddress[campaignAddress] = true;

        emit Events.CampaignCreated(
            msg.sender,
            campaignAddress,
            block.timestamp
        );
    }

    /**
     * @notice Verify and reward user for completing a task
     * @dev This function can be called by the factory owner (oracle/backend) after verifying task completion
     * @param _campaignAddress The campaign contract address
     * @param _user The user who completed the task
     * @param _taskId The ID of the completed task
     */
    function verifyAndRewardUser(
        address _campaignAddress,
        address _user,
        uint256 _taskId
    ) external onlyOwner {
        require(isCampaignAddress[_campaignAddress], "Invalid campaign address");
        
        Campaign campaign = Campaign(payable(_campaignAddress));
        campaign.rewardUser(_user, _taskId);
        
        emit TaskCompleted(_user, _campaignAddress, _taskId);
    }

    function getAllCampaigns() external view returns (address[] memory) {
        return allCampaigns;
    }

    function getCampaignsByOwner(
        address _owner
    ) external view returns (address[] memory) {
        return campaignsByOwner[_owner];
    }

    function isCampaign(address _campaignAddress) external view returns (bool) {
        return isCampaignAddress[_campaignAddress];
    }

    function togglePause() external onlyOwner {
        paused = !paused;
        emit Events.PausedStateChanged(paused);
    }

    function setUserRegistry(
        address _newUserRegistryAddress
    ) external onlyOwner {
        userRegistry = UserRegistry(_newUserRegistryAddress);
    }
}