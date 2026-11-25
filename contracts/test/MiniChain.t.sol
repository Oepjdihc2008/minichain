// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../src/MiniChain.sol";

contract MiniChainTest {
    MiniChain private target;

    function setUp() public {
        target = new MiniChain();
    }

    function testInitialCounter() public view {
        require(target.counter() == 0);
    }

    function testIncrement() public {
        target.increment();
        require(target.counter() == 1);
    }

    function testMultipleIncrements() public {
        for (uint256 i = 0; i < 100; i++) {
            target.increment();
        }
        require(target.counter() == 100);
    }

    function testSetMessage() public {
        target.setMessage("Test successful");

        require(
            keccak256(bytes(target.message())) ==
            keccak256(bytes("Test successful"))
        );
    }

    function testFuzzMessage(string memory value) public {
        target.setMessage(value);

        require(
            keccak256(bytes(target.message())) ==
            keccak256(bytes(value))
        );
    }
}
