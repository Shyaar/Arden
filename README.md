# Arden

**Find your first real users.**

Arden helps new Web3 products find their first real users by connecting builders who want genuine feedback with real users who explore, test, and get rewarded for completing tasks.

---

## Overview

Building a decentralized application is one thing — getting real users to test it is another.  
Arden bridges this gap by allowing projects to launch incentivized campaigns that attract real testers, not bots.

- Builders list their DApps and define tasks.  
- Users complete those tasks and earn rewards.  
- Rewards are distributed transparently on-chain using Base and Ethereum.

---

## Problem

Most new DApps struggle to:
- Get authentic user testing and feedback.  
- Verify that engagement is real and not automated.  
- Offer meaningful on-chain incentives to testers.

Meanwhile, users want:
- A trusted way to discover new projects.  
- Clear instructions on what to do.  
- Instant and fair rewards.

Arden brings both sides together.

---

## Solution

Arden is a discovery and engagement platform that lets:
- Builders create campaigns with custom tasks and reward structures.  
- Users find, test, and earn ETH/Base by completing verified tasks.

---

## How Arden Works

### For Builders
1. **List Your Product** — Create a campaign and define specific actions or goals.  
2. **Get Real Engagement** — Users discover your DApp and complete tasks.  
3. **Reward Participation** — Once verified, users earn ETH/Base rewards.

**Start your first campaign →**

---

### For Users
1. **Discover New Projects** — Explore campaigns from Web3 builders.  
2. **Complete Tasks** — Perform simple on-chain or off-chain actions.  
3. **Earn Rewards** — Verified participation earns you ETH/Base tokens.

**Start exploring DApps →**

---

## Core Features (MVP)

### Builders
- Create and manage campaigns.  
- Define task types (on-chain / off-chain).  
- Fund and track reward pools.  
- View engagement analytics.

### Users
- Browse active DApps and challenges.  
- Connect wallet and join campaigns.  
- Complete and submit proof of tasks.  
- Claim on-chain rewards.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + TailwindCSS + Wagmi + WalletConnect |
| Backend | Node.js + Express |
| Blockchain | Base + Ethereum |
| Smart Contracts | Solidity (ERC-20/ERC-721 interactions) |
| Database | Firebase / Supabase |

---

## Smart Contract Architecture

### Contracts (MVP)
- **CampaignFactory.sol** — Deploys new campaign contracts.  
- **Campaign.sol** — Handles task creation, verification, and reward logic.  
- **RewardDistributor.sol** — Manages payout in ETH/Base.

**Flow:**  
Builder → Create Campaign → Fund Pool → Users Complete Tasks → Verification → Rewards Distributed.

---

## Incentivization Model

- Campaigns are funded by builders.  
- Each task has a defined reward.  
- Verification is handled on-chain (or by the builder for MVP).  
- Users can claim rewards in ETH or Base once approved.

---

## User Flow

### Builders
Landing → Connect Wallet → Create Campaign → Fund Pool → Track Engagement

### Users
Landing → Connect Wallet → Browse Campaigns → Complete Tasks → Claim Rewards

---

## MVP Goals
- Validate that builders can find early users through Arden.  
- Attract the first wave of testers and Web3 projects.  
- Build seamless ETH/Base reward mechanics.

---


## License
MIT © 2025 Arden

---

## Connect

We’re building Arden to help the next generation of Web3 products grow faster.  
Stay tuned as we onboard the first builders and testers.

**Have a DApp you want to test? Join the waitlist soon.**
