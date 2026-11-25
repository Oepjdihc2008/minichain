// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MiniChain {
    uint256 public counter;
    string public message = "Hello MiniChain";

    event Updated(uint256 value);

    function increment() external {
        counter += 1;
        emit Updated(counter);
    }

    function setMessage(string calldata newMessage) external {
        message = newMessage;
    }
}
