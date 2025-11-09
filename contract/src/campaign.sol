// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "./lib/events/campaignEvents.sol";
import "./lib/errors/campaignErrors.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Campaign
 * @notice Represents a single campaign created by a verified product owner
 * @dev Each campaign maintains its own budget, task list, and reward logic
 */
contract Campaign is Ownable, ReentrancyGuard {
    // ============ State Variables ============
    
    address public immutable factory;
    string public campaignName;
    string public dappLink;
    uint256 public totalBudget;
    uint256 public remainingBudget;
    uint256 public reservedBudget; // funds reserved for created tasks (not yet paid out)
    uint256 public campaignEndTime;
    bool public isActive;
    uint256 private taskCounter;

    // ============ Structs ============
    
    struct Task {
        uint256 id;
        string title;
        string description;
        uint256 reward;
        bool isActive;
        uint256 completionCount;
    }

    // ============ Mappings ============
    
    mapping(uint256 => Task) public tasks;
    mapping(address => mapping(uint256 => bool)) public userTaskCompletion;
    mapping(address => uint256) public userTotalRewards;

    // ============ Modifiers ============
    
    modifier onlyFactory() {
        if (msg.sender != factory) revert OnlyFactory();
        _;
    }

    modifier campaignActive() {
        if (!isActive) revert CampaignInactive();
        _;
    }

    // ============ Constructor ============
    
    /**
     * @notice Initialize a new campaign
     * @param _owner Campaign owner (product builder)
     * @param _campaignName Name of the campaign
     * @param _dappLink Link to the DApp
     * @param _campaignEndTime Unix timestamp for campaign end
     */
    constructor(
        address _owner,
        string memory _campaignName,
        string memory _dappLink,
        uint256 _budget,
        uint256 _campaignEndTime
    ) Ownable(_owner) {
        factory = msg.sender;
        campaignName = _campaignName;
        dappLink = _dappLink;
        totalBudget = _budget;
        campaignEndTime = _campaignEndTime;
        isActive = true;
    }

    // ============ Budget Management ============
    
    /**
     * @notice Increase campaign budget (top-up funds)
     * @dev Only owner can increase budget, emits BudgetIncreased event
     */
    function increaseBudget() external payable onlyOwner {
        if (msg.value == 0) revert InsufficientBudget();
        
        totalBudget += msg.value;
        remainingBudget += msg.value;
        
        emit BudgetIncreased(msg.value, totalBudget);
    }

    // ============ Task Management ============
    
    /**
     * @notice Create a new task for the campaign
     * @param _title Task title
     * @param _description Task description
     * @param _reward Reward amount in wei
     */
    function createTask(
        string memory _title,
        string memory _description,
        uint256 _reward
    ) external onlyOwner campaignActive {
        if (_reward == 0) revert InvalidReward();
        if (block.timestamp > campaignEndTime) revert CampaignNotEnded();
        if (_reward > remainingBudget) revert InsufficientBudget();

        uint256 taskId = taskCounter++;
        
        tasks[taskId] = Task({
            id: taskId,
            title: _title,
            description: _description,
            reward: _reward,
            isActive: true,
            completionCount: 0
        });

        // Reserve funds for this task so owner cannot double spend
        remainingBudget -= _reward;
        reservedBudget += _reward;

        emit TaskCreated(taskId, _title, _reward);
    }

    /**
     * @notice Toggle task active status
     * @param _taskId ID of the task to toggle
     * @param _status New status (true = active, false = inactive)
     */
    function toggleTask(uint256 _taskId, bool _status) external onlyOwner {
        if (_taskId >= taskCounter) revert TaskNotFound();
        
        tasks[_taskId].isActive = _status;
        
        emit TaskToggled(_taskId, _status);
    }

    // ============ Campaign Controls ============
    
    /**
     * @notice Toggle campaign active status
     * @param _status New status (true = active, false = inactive)
     */
    function toggleCampaign(bool _status) external onlyOwner {
        isActive = _status;
        
        emit CampaignToggled(_status);
    }

    /**
     * @notice Withdraw remaining funds after campaign ends
     * @dev Only callable after campaign end time
     */
    function withdrawRemainingFunds() external onlyOwner nonReentrant {
        if (block.timestamp < campaignEndTime) revert CampaignNotEnded();
        
        uint256 amount = remainingBudget;
        remainingBudget = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        if (!success) revert TransferFailed();
        
        emit FundsWithdrawn(owner(), amount);
    }

    // ============ Reward Distribution ============
    
    /**
     * @notice Verify and reward user for task completion
     * @param _user Address of the user to reward
     * @param _taskId ID of the completed task
     * @dev Called by factory or oracle after verification
     */
    function rewardUser(address _user, uint256 _taskId) 
        external 
        onlyFactory 
        nonReentrant 
    {
        if (_taskId >= taskCounter) revert TaskNotFound();
        if (_user == address(0)) revert InvalidAddress();

        Task storage task = tasks[_taskId];
        
        if (!task.isActive) revert TaskInactive();
        if (!isActive) revert CampaignInactive();
        if (block.timestamp > campaignEndTime) revert CampaignNotEnded();
        if (userTaskCompletion[_user][_taskId]) revert TaskAlreadyCompleted();
        if (task.reward > reservedBudget) revert InsufficientBudget();

        // Mark task as completed for user
        userTaskCompletion[_user][_taskId] = true;
        task.completionCount++;
        
        // Update reserved budget and user tracking
        reservedBudget -= task.reward;
        userTotalRewards[_user] += task.reward;
        
        // Transfer reward
        (bool success, ) = payable(_user).call{value: task.reward}("");
        if (!success) revert TransferFailed();
        
        emit RewardDistributed(_user, _taskId, task.reward);
    }

    // ============ View Functions ============
    
    /**
     * @notice Get task details
     * @param _taskId ID of the task
     * @return Task struct
     */
    function getTask(uint256 _taskId) external view returns (Task memory) {
        if (_taskId >= taskCounter) revert TaskNotFound();
        return tasks[_taskId];
    }

    /**
     * @notice Get total number of tasks
     * @return Total task count
     */
    function getTaskCount() external view returns (uint256) {
        return taskCounter;
    }

    /**
     * @notice Check if user completed a specific task
     * @param _user User address
     * @param _taskId Task ID
     * @return True if completed, false otherwise
     */
    function hasUserCompletedTask(address _user, uint256 _taskId) 
        external 
        view 
        returns (bool) 
    {
        return userTaskCompletion[_user][_taskId];
    }

    /**
     * @notice Get campaign details
     * @return name Campaign name
     * @return link DApp link
     * @return total Total budget
     * @return remaining Remaining budget
     * @return reserved Reserved funds for tasks
     * @return endTime Campaign end time
     * @return active Campaign status
     */
    function getCampaignDetails() 
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
        return (
            campaignName,
            dappLink,
            totalBudget,
            remainingBudget,
            reservedBudget,
            campaignEndTime,
            isActive
        );
    }

    // ============ Emergency Functions ============
    
    /**
     * @notice Emergency withdraw in case of critical issues
     * @dev Only callable by owner after campaign ends
     */
    function emergencyWithdraw() external onlyOwner nonReentrant {
        if (block.timestamp < campaignEndTime) revert CampaignNotEnded();
        
        uint256 balance = address(this).balance;
        remainingBudget = 0;
        reservedBudget = 0; // wipes reserved funds for tasks
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) revert TransferFailed();
        
        emit FundsWithdrawn(owner(), balance);
    }

    // ============ Receive Function ============
    
    /**
     * @notice Allow contract to receive ETH
     */
    receive() external payable {
        totalBudget += msg.value;
        remainingBudget += msg.value;
        emit BudgetIncreased(msg.value, totalBudget);
    }
}
