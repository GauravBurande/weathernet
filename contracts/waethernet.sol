// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WeatherDataStorage is Ownable {
    
    // Simple node structure
    struct Node {
        address owner;
        address tokenAddress;
        uint256 hashCount;
        bool active;
    }
    
    // Mappings
    mapping(string => Node) public nodes;
    mapping(string => uint256) public rewards; // deviceId => reward amount
    
    // Config
    uint256 public rewardPerHash = 1e18; // 1 token per hash
    uint256 public minHashesToClaim = 10;
    
    // Events
    event NodeCreated(string deviceId, address owner);
    event HashStored(string deviceId);
    event TokensClaimed(string deviceId, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create new node
     */
    function initiateNode(string memory deviceId, address tokenAddress) external {
        require(!nodes[deviceId].active, "Node exists");
        
        nodes[deviceId] = Node({
            owner: msg.sender,
            tokenAddress: tokenAddress,
            hashCount: 0,
            active: true
        });
        
        emit NodeCreated(deviceId, msg.sender);
    }
    
    /**
     * @dev Store hash and earn rewards
     */
    function storeHash(string memory deviceId, string memory) external {
        require(nodes[deviceId].active, "Node inactive");
        require(nodes[deviceId].owner == msg.sender, "Not owner");
        
        nodes[deviceId].hashCount++;
        rewards[deviceId] += rewardPerHash;
        
        emit HashStored(deviceId);
    }
    
    /**
     * @dev Claim earned tokens
     */
    function claimTokens(string memory deviceId) external {
        require(nodes[deviceId].owner == msg.sender, "Not owner");
        require(nodes[deviceId].hashCount >= minHashesToClaim, "Need more hashes");
        require(rewards[deviceId] > 0, "No rewards");
        
        uint256 amount = rewards[deviceId];
        rewards[deviceId] = 0;
        
        IERC20(nodes[deviceId].tokenAddress).transfer(msg.sender, amount);
        
        emit TokensClaimed(deviceId, amount);
    }
    
    // View functions
    function getRewards(string memory deviceId) external view returns (uint256) {
        return rewards[deviceId];
    }
    
    function getHashCount(string memory deviceId) external view returns (uint256) {
        return nodes[deviceId].hashCount;
    }
    
    // Owner functions
    function setRewardPerHash(uint256 newReward) external onlyOwner {
        rewardPerHash = newReward;
    }
    
    function depositTokens(address tokenAddress, uint256 amount) external {
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
    }
}