// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

library RegistryErrors {
    error UserNotRegistered();
    error UserAlreadyVerified();
    error UserAlreadyRegistered();
    error InvalidRole();
}
