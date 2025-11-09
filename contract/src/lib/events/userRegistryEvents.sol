// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {UserRegistry} from "../../usersRegistry.sol";

library RegistryEvents {
    event UserRegistered(
        address indexed user,
        string firstName,
        string lastName,
        UserRegistry.Role role
    );
    event UserVerified(address indexed user);
}
