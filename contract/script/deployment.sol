// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;


import {Script} from "forge-std/Script.sol";
import { Campaign } from "../src/campaign.sol";
import { CampaignFactory } from "../src/campaignFactory.sol";
import { UserRegistry } from "../src/usersRegistry.sol";



// contract CampaignScript is Script {
//     Campaign public campaign;

//     function setUp() public {}

//     function run() public {
//         vm.startBroadcast();

//         Campaign = new Campaign();

//         vm.stopBroadcast();
//     }
// }

contract RegistryScript is Script {
    UserRegistry public userRegistry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        userRegistry = new UserRegistry();

        vm.stopBroadcast();
    }
}

contract FactoryScript is Script {
    CampaignFactory public campaignFactory;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        campaignFactory = new CampaignFactory(0xF582B37438Fda14aa4e10580AD12D4B363a8A77F);

        vm.stopBroadcast();
    }
}
