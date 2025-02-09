<h1 align="center">Artix.fun</h1>
<h3 align="center">Meme Contest DAO Platform</h3>

<p align="center">
  <a href="https://artixfun.vercel.app/" style="color: #a77dff">Platform</a> | <a href="https://www.figma.com/deck/2SOyNcL3NwvpAuOzHHwfty" style="color: #a77dff">Pitchdeck</a> | <a href="" style="color: #a77dff">Demo Video</a>
</p>
<p align="center">
  <a href="https://github.com/marcdhi/Artix.fun/blob/main/artixContracts/ignition/deployments/chain-84532/deployed_addresses.json" style="color: #a77dff">Base(NFT&Vote Contract)</a> | <a href="https://github.com/marcdhi/Artix.fun/blob/main/frontend/src/main.tsx" style="color: #a77dff">Privy(Auth&Wallets)</a> | <a href="https://github.com/marcdhi/Artix.fun/blob/main/agents/twitter-agent.js" style="color: #a77dff">Coinbase Developer Kit(Agent NFT Mint)</a> | <a href="https://github.com/marcdhi/Artix.fun/blob/main/agents/twitter-agent.js" style="color: #a77dff">Autonome(AI agent)</a>

---

## 📌 Project Description

Artix.fun is a **Web3-based meme contest DAO platform** where memes created by users are **evaluated through on-chain voting**, automatically minted as **NFTs via AI agents**, and promoted through **viral marketing** on social media.

In the past, meme creators **did not receive proper recognition or rewards**, even if their memes went viral. Artix.fun addresses this issue by providing **DAO voting, NFT-based ownership verification, AI-powered marketing automation, and a meme utilization reward system**, creating an environment where **creators and the community can grow together**.

## ⚠️ Problem Statement

1. **Lack of rewards for meme creators**
    - Many memes become widely popular, but **the original creator does not receive financial benefits or recognition**.
    - There is **no way to prove ownership** of a meme.
2. **Lack of meme valuation and on-chain records**
    - Memes are shared and disappear without being **recorded as digital assets**.
    - There is no proper **on-chain system to evaluate and reward memes**.
3. **Inefficiency in meme viral marketing**
    - Memes spread mainly through community sharing, but **there is no structured system to promote them effectively**.
4. **No rewards for community participants**
    - Users who **vote or help memes go viral do not receive any benefits**.

## 💡 Solution

1. **On-chain DAO voting system to select the most popular memes**
    - All users can vote for memes, and **the meme that reaches the highest vote count is automatically selected**.
2. **AI-powered NFT minting & social media promotion**
    - The winning meme is **automatically minted as an NFT**, ensuring **the creator’s ownership**.
    - The **AI agent promotes the meme on social media (Twitter, etc.)**, maximizing its exposure.
3. **Reward system for DAO voters**
    - Users who participate in DAO voting can **freely use the selected meme**.
    - If the creator later launches a **token related to the meme, voters get whitelisted**.
    - If no token is launched, **users receive reward points on our platform**.
4. **Ranking NFT system for voter participation**
    - Users can accumulate points and **mint their own NFTs**.
    - These NFTs display **which memes the user voted for, how much they contributed, and their ranking**.
    - This creates a **leaderboard system** where users can track their voting influence.

## How to use the Sponsor

**🔹 Privy - Seamless User Onboarding & Authentication**
- We integrated Privy to provide a seamless and secure onboarding experience for all users. By configuring Coinbase Wallet, Google Auth, Email Login, MetaMask, and Phantom Wallet, we enable both Web3-native and non-Web3 users to easily sign up and participate in on-chain voting, NFT minting, and meme contests without friction. This ensures broad accessibility while maintaining security and ease of use.

**🔹 Autonome - AI-Powered Meme Minting & Marketing**
- To automate meme NFT minting and marketing, we developed a Node.js backend that uses AI agents to manage these tasks. The AI agent, Artix, automatically mints NFTs for winning memes and promotes them on Twitter, ensuring viral marketing and increased visibility. The entire application is Dockerized and deployed on the Autonome platform, providing a scalable and autonomous system for meme activation.

**🔹 Coinbase Developer Kit - AI Agent Wallet for NFT Minting**
- We leveraged Coinbase’s AgentKit and SDK to develop an AI-powered agent wallet responsible for automatically minting NFTs when a meme reaches the top-voted threshold. This ensures a secure, verifiable, and decentralized ownership process, reducing manual intervention while enhancing automation. (GitHub source code for the agent implementation can be attached here.)

**🔹 Base - Cost-Effective & Scalable Smart Contracts**
- We deployed all smart contracts on Base, an Ethereum Layer 2 network, to optimize for low-cost transactions, scalability, and security. This allows for efficient on-chain voting, NFT minting, and reward distribution without high gas fees, making it accessible for a wider audience. (All deployed contract addresses can be attached here.)

## Demo preview
![home](https://github.com/user-attachments/assets/8527ed40-b982-4b45-8dd3-8d9d07397ee4)

![profile](https://github.com/user-attachments/assets/cb7781cf-f8b7-44ef-a2f0-2779c44421b1)

![meme](https://github.com/user-attachments/assets/88bec482-00d4-4b89-b4fe-c650d0cdba97)

![discover-meme](https://github.com/user-attachments/assets/74f4f47c-bcf2-48a4-8ea1-3f21943b3b01)


![create-meme](https://github.com/user-attachments/assets/13dd617e-7e56-44f5-a294-c060ed9f8383)

![create-meme-2](https://github.com/user-attachments/assets/6f21432c-900d-4977-ba2e-1eb1e994a47e)

![leaderboard](https://github.com/user-attachments/assets/b6ed9c95-dbf7-4928-8847-61db83e5c4bb)

![minted](https://github.com/user-attachments/assets/dd06b663-8e94-4383-b1c6-5176773aa132)

![leaderboard](https://github.com/user-attachments/assets/58d9927a-58ec-4364-973a-88b6511a3328)

![voting-history](https://github.com/user-attachments/assets/e54618ab-f8e2-47d0-87a8-10c379eb74d4)










---

# Frontend

This is the frontend for the Artix.fun website. It is built using React and Typescript.

## Getting Started

To get started, clone the repository and run the following commands:

```bash
cd frontend
bun install
bun run dev
```
