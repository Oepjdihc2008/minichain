// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../src/MNC.sol";

contract MNCFuzzTest {
    MNC token;

    function setUp() public {
        token = new MNC();
    }

    function testFuzzSupplyConservation(
        uint256 amount
    ) public {
        uint256 supply = token.totalSupply();
        amount = amount % (supply + 1);

        token.transfer(address(123), amount);

        require(
            token.balanceOf(address(this)) +
            token.balanceOf(address(123)) == supply
        );

        require(token.totalSupply() == supply);
    }

    function testFuzzSelfTransfer(
        uint256 amount
    ) public {
        uint256 before = token.balanceOf(address(this));
        amount = amount % (before + 1);

        token.transfer(address(this), amount);

        require(
            token.balanceOf(address(this)) == before
        );
    }

    function testFuzzAllowance(
        uint256 amount
    ) public {
        amount = amount % (token.totalSupply() + 1);

        token.approve(address(this), amount);

        token.transferFrom(
            address(this),
            address(123),
            amount
        );

        require(
            token.balanceOf(address(123)) == amount
        );

        require(
            token.allowance(address(this), address(this)) == 0
        );
    }

    function testUnauthorizedTransfer() public {
        try token.transferFrom(
            address(this), address(123), 1
        ) {
            revert("Unauthorized transfer succeeded");
        } catch {}
    }

    function testZeroTransfer() public {
        uint256 before = token.balanceOf(address(this));

        require(token.transfer(address(123), 0));
        require(token.balanceOf(address(this)) == before);
    }
}
