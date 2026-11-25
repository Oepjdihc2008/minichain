// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../src/MNC.sol";

contract MNCTest {

    MNC token;

    function setUp() public {
        token = new MNC();
    }

    function testTotalSupply() public view {
        require(
            token.totalSupply() == 1_000_000 ether
        );
    }

    function testInitialBalance() public view {
        require(
            token.balanceOf(address(this))
            == token.totalSupply()
        );
    }

    function testTransfer() public {
        token.transfer(address(123), 100 ether);

        require(
            token.balanceOf(address(123))
            == 100 ether
        );
    }

    function testInsufficientBalance() public {
        try token.transfer(
            address(123),
            2_000_000 ether
        ) {
            revert("Transfer should fail");
        } catch {}
    }

    function testZeroAddressRejected() public {
        try token.transfer(address(0), 1 ether) {
            revert("Transfer should fail");
        } catch {}
    }

    function testApproval() public {
        token.approve(address(123), 500 ether);

        require(
            token.allowance(
                address(this),
                address(123)
            ) == 500 ether
        );
    }

    function testTransferFrom() public {
        token.approve(address(this), 100 ether);

        token.transferFrom(
            address(this),
            address(123),
            100 ether
        );

        require(
            token.balanceOf(address(123))
            == 100 ether
        );

        require(
            token.allowance(
                address(this),
                address(this)
            ) == 0
        );
    }
}
