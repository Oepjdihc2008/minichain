// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "../src/MiniChainV2.sol";

contract ExternalUser {
    function modifyMessage(
        MiniChainV2 target
    ) external returns (bool) {
        (bool success,) = address(target).call(
            abi.encodeCall(
                MiniChainV2.setMessage,
                ("Unauthorized update")
            )
        );
        return success;
    }
}

contract MiniChainV2Test {
    MiniChainV2 target;

    function setUp() public {
        target = new MiniChainV2();
    }

    function testOwner() public view {
        require(target.owner() == address(this));
    }

    function testOwnerCanModify() public {
        target.setMessage("Authorized");

        require(
            keccak256(bytes(target.message())) ==
            keccak256(bytes("Authorized"))
        );
    }

    function testRejectUnauthorized() public {
        ExternalUser user = new ExternalUser();
        require(!user.modifyMessage(target));

        require(
            keccak256(bytes(target.message())) ==
            keccak256(bytes("MiniChain V2"))
        );
    }
}
