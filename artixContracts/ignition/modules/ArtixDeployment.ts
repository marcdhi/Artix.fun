import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";
import { artifacts } from "hardhat";
import { defaultAbiCoder } from "@ethersproject/abi";
import { Interface } from "@ethersproject/abi";

// Deployment Configuration
const VOTING_MAX_VOTES = 100;
const CONTEST_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds
const MIN_VOTES_TO_WIN = 10;
const VOTE_COST = parseEther("0.01"); // 0.01 ETH

const ArtifactDeploymentModule = buildModule("ArtifactDeployment", (m) => {
  // Get deployment parameters
  const admin = m.getParameter("admin", "0x8880bfd0a9c311a92e1be07330153721e4402700");
  
  // Deploy core contracts
  const memeContestImpl = m.contract("ArtifactMemeContest", [], { id: "MemeContestImpl" });
  const nftContract = m.contract("ArtifactNFT", [], { id: "NFTContract" });
  const rankingImpl = m.contract("ArtifactRanking", [], { id: "RankingImpl" });

  // Create initialization data for MemeContest using Interface
  const memeContestInterface = new Interface([
    "function initialize(uint256 maxVotes, uint256 contestDuration, uint256 minVotesToWin, uint256 voteCost)"
  ]);

  const memeContestData = memeContestInterface.encodeFunctionData("initialize", [
    VOTING_MAX_VOTES,
    CONTEST_DURATION,
    MIN_VOTES_TO_WIN,
    VOTE_COST
  ]);

  // Create initialization data for Ranking using Interface
  const rankingInterface = new Interface([
    "function initialize()"
  ]);

  const rankingData = rankingInterface.encodeFunctionData("initialize", []);

  // Deploy MemeContest with proxy setup
  const memeContestProxy = m.contract("TransparentProxy", [
    memeContestImpl,
    admin,
    memeContestData
  ], { id: "MemeContestProxy" });

  // Deploy Ranking Contract with proxy setup
  const rankingProxy = m.contract("TransparentProxy", [
    rankingImpl,
    admin,
    rankingData
  ], { id: "RankingProxy" });

  // Create contract instances at the proxy addresses
  const memeContest = m.contractAt("ArtifactMemeContest", memeContestProxy, { id: "MemeContestProxied" });
  const ranking = m.contractAt("ArtifactRanking", rankingProxy, { id: "RankingProxied" });

  return {
    "ArtifactMemeContest_Implementation": memeContestImpl,
    "ArtifactMemeContest_Proxy": memeContestProxy,
    "ArtifactMemeContest": memeContest,
    "ArtifactNFT": nftContract,
    "ArtifactRanking_Implementation": rankingImpl,
    "ArtifactRanking_Proxy": rankingProxy,
    "ArtifactRanking": ranking
  };
});

export default ArtifactDeploymentModule;