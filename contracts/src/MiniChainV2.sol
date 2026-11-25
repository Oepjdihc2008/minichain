// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MiniChainV2 {
    address public immutable owner;
    uint256 public counter;
    string public message = "MiniChain V2";

    error Unauthorized();

    event Updated(uint256 value);
    event MessageUpdated(string value);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Unauthorized();
        }
        _;
    }

    function increment() external {
        counter += 1;
        emit Updated(counter);
    }

    function setMessage(
        string calldata value
    ) external onlyOwner {
        message = value;
        emit MessageUpdated(value);
    }
}
