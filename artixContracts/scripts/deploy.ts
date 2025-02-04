// scripts/deploy.ts
import { ethers, run } from "hardhat";
import hre from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";


  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  console.log("Account balance:", ethers.formatEther(balance), "ETH");
  const balance = await deployer.getBalance();
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
  const ArtifactMemeContest = await ethers.getContractFactory("ArtifactMemeContest");
  // Deploy ArtifactMemeContest Contract
  const ArtifactMemeContest = await hre.ethers.getContractFactory("ArtifactMemeContest");
  const memeContestArgs = [
    100,    // Max votes per meme
    ethers.parseEther("0.01")  // Vote cost (0.01 ETH)
    10,     // Minimum votes to win
    hre.ethers.parseEther("0.01")  // Vote cost (0.01 ETH)
  const memeContest = await upgrades.deployProxy(
  
  const memeContest = await hre.upgrades.deployProxy(
    ArtifactMemeContest, 
    memeContestArgs, 
    { 
      initializer: "initialize",
      kind: "uups"
    }
  );
  await memeContest.waitForDeployment();
  console.log("ArtifactMemeContest deployed to:", await memeContest.getAddress());
  const ArtifactNFT = await ethers.getContractFactory("ArtifactNFT");
  // Deploy ArtifactNFT Contract
  const ArtifactNFT = await hre.ethers.getContractFactory("ArtifactNFT");
  const nftContract = await ArtifactNFT.deploy();
  await nftContract.deploymentTransaction().wait(1);
  console.log("ArtifactNFT deployed to:", await nftContract.getAddress());
  const ArtifactRanking = await ethers.getContractFactory("ArtifactRanking");
  const rankingContract = await upgrades.deployProxy(
  const ArtifactRanking = await hre.ethers.getContractFactory("ArtifactRanking");
  const rankingContract = await hre.upgrades.deployProxy(
    ArtifactRanking, 
    [], 
    { 
      initializer: "initialize",
      kind: "uups"
    }
  );
  await rankingContract.waitForDeployment();
  console.log("ArtifactRanking deployed to:", await rankingContract.getAddress());

  // Verify contracts on Block Explorer
  await verifyContracts(
    await memeContest.getAddress(),
    await nftContract.getAddress(),
    await rankingContract.getAddress()
  );
// Verification Function
async function verifyContracts(memeContestAddress: string, nftAddress: string, rankingAddress: string) {
// Verification Function
async function verifyContracts(memeContestAddress, nftAddress, rankingAddress) {
  console.log("Verifying contracts on Block Explorer...");
  
  try {
    // Verify MemeContest (Proxy)
    await hre.run("verify:verify", {
      address: memeContestAddress,
      constructorArguments: []
    });

    // Verify NFT Contract
    await hre.run("verify:verify", {
      address: nftAddress,
      constructorArguments: []
    });

    // Verify Ranking Contract (Proxy)
    await hre.run("verify:verify", {
      address: rankingAddress,
      constructorArguments: []
    });

    console.log("All contracts verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

  .catch((error: Error) => {
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });