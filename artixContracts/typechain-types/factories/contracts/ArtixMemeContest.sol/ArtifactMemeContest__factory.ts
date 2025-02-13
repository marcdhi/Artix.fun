/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../common";
import type {
  ArtifactMemeContest,
  ArtifactMemeContestInterface,
} from "../../../contracts/ArtixMemeContest.sol/ArtifactMemeContest";

const _abi = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "memeId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "networkId",
        type: "uint256",
      },
    ],
    name: "MemeSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "memeId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    name: "MemeWinner",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "memeId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votingPower",
        type: "uint256",
      },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_contestDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minVotesForWin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_voteCost",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "memes",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "socialLinks",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "networkId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "submissionTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasBeenMinted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "string",
        name: "socialLinks",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "networkId",
        type: "uint256",
      },
    ],
    name: "submitMeme",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_contestDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minVotesForWin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_voteCost",
        type: "uint256",
      },
    ],
    name: "updateVotingConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userVotedMemes",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "memeId",
        type: "uint256",
      },
    ],
    name: "voteMeme",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "votingConfiguration",
    outputs: [
      {
        internalType: "uint256",
        name: "maxVotes",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "contestDuration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minVotesForWin",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "voteCost",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506111de806100206000396000f3fe60806040526004361061009c5760003560e01c8063715018a611610064578063715018a61461018b578063835da7e0146101a0578063867d6073146101e35780638da5cb5b146101f6578063df58da6e1461023d578063f2fde38b1461025d57600080fd5b806308f6c452146100a157806309065d12146100d4578063388f6064146100e9578063438596321461012057806360a2da441461016b575b600080fd5b3480156100ad57600080fd5b506100c16100bc366004610ce4565b61027d565b6040519081526020015b60405180910390f35b6100e76100e2366004610db1565b6102ae565b005b3480156100f557600080fd5b50610109610104366004610e66565b6104e5565b6040516100cb9b9a99989796959493929190610ec5565b34801561012c57600080fd5b5061015b61013b366004610f62565b600260209081526000928352604080842090915290825290205460ff1681565b60405190151581526020016100cb565b34801561017757600080fd5b506100e7610186366004610f8e565b61076a565b34801561019757600080fd5b506100e76108b9565b3480156101ac57600080fd5b506004546005546006546007546101c39392919084565b6040805194855260208501939093529183015260608201526080016100cb565b6100e76101f1366004610e66565b6108cd565b34801561020257600080fd5b507f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546040516001600160a01b0390911681526020016100cb565b34801561024957600080fd5b506100e7610258366004610f8e565b610adf565b34801561026957600080fd5b506100e7610278366004610fc0565b610afb565b6003602052816000526040600020818154811061029957600080fd5b90600052602060002001600091509150505481565b6102b6610b36565b60008551116103005760405162461bcd60e51b8152602060048201526011602482015270092dcecc2d8d2c84092a08ca640d0c2e6d607b1b60448201526064015b60405180910390fd5b60008451116103425760405162461bcd60e51b815260206004820152600e60248201526d151a5d1b19481c995c5d5a5c995960921b60448201526064016102f7565b610350600080546001019055565b6000805460408051610160810182528281523360208083019182528284018b8152606084018b9052608084018a905260a0840189905260c08401889052600060e0850181905242610100860152600161012086018190526101408601829052878252928390529490942083518155915190820180546001600160a01b0319166001600160a01b0390921691909117905591519293509160028201906103f5908261106b565b506060820151600382019061040a908261106b565b506080820151600482019061041f908261106b565b5060a08201516005820190610434908261106b565b5060c0820151600682015560e08201516007820155610100808301516008830155610120830151600990920180546101409094015161ffff1990941692151561ff0019169290921792151502919091179055604051339082907f793d9f0160c22adbd8c9208cd00814a1f05eaf96c763d8298a5fc2a1426f0cd0906104be908a908a90889061112b565b60405180910390a3506104de600160008051602061118983398151915255565b5050505050565b60016020819052600091825260409091208054918101546002820180546001600160a01b03909216929161051890610fe2565b80601f016020809104026020016040519081016040528092919081815260200182805461054490610fe2565b80156105915780601f1061056657610100808354040283529160200191610591565b820191906000526020600020905b81548152906001019060200180831161057457829003601f168201915b5050505050908060030180546105a690610fe2565b80601f01602080910402602001604051908101604052809291908181526020018280546105d290610fe2565b801561061f5780601f106105f45761010080835404028352916020019161061f565b820191906000526020600020905b81548152906001019060200180831161060257829003601f168201915b50505050509080600401805461063490610fe2565b80601f016020809104026020016040519081016040528092919081815260200182805461066090610fe2565b80156106ad5780601f10610682576101008083540402835291602001916106ad565b820191906000526020600020905b81548152906001019060200180831161069057829003601f168201915b5050505050908060050180546106c290610fe2565b80601f01602080910402602001604051908101604052809291908181526020018280546106ee90610fe2565b801561073b5780601f106107105761010080835404028352916020019161073b565b820191906000526020600020905b81548152906001019060200180831161071e57829003601f168201915b505050506006830154600784015460088501546009909501549394919390925060ff808216916101009004168b565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff166000811580156107b05750825b905060008267ffffffffffffffff1660011480156107cd5750303b155b9050811580156107db575080155b156107f95760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff19166001178555831561082357845460ff60401b1916600160401b1785555b61082c33610b82565b610834610b93565b604080516080810182528a8152602081018a9052908101889052606001869052600489905560058890556006879055600786905583156108ae57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b505050505050505050565b6108c1610ba3565b6108cb6000610bfe565b565b6108d5610b36565b6000818152600160205260409020600981015460ff1661092c5760405162461bcd60e51b81526020600482015260126024820152714d656d65206973206e6f742061637469766560701b60448201526064016102f7565b600082815260026020908152604080832033845290915290205460ff16156109865760405162461bcd60e51b815260206004820152600d60248201526c105b1c9958591e481d9bdd1959609a1b60448201526064016102f7565b6007543410156109d15760405162461bcd60e51b8152602060048201526016602482015275125b9cdd59999a58da595b9d081d9bdd194818dbdcdd60521b60448201526064016102f7565b6007810180549060006109e383611161565b9091555050600082815260026020908152604080832033808552908352818420805460ff1916600190811790915560038452828520805480830182559086529484902090940186905590519283529184917f2acce567deca3aabf56327adbb4524bd5318936eaefa69e3a5208ffda0cfec09910160405180910390a3600454600782015410610ac45760098101805460ff19169055600181015460078201546040519081526001600160a01b039091169083907f99b34a06771e5344b73e8b0a0458abd04f1642f8353a3ebb1a352f74310d11f99060200160405180910390a35b50610adc600160008051602061118983398151915255565b50565b610ae7610ba3565b600493909355600591909155600655600755565b610b03610ba3565b6001600160a01b038116610b2d57604051631e4fbdf760e01b8152600060048201526024016102f7565b610adc81610bfe565b600080516020611189833981519152805460011901610b6857604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b600160008051602061118983398151915255565b610b8a610c6f565b610adc81610cb8565b610b9b610c6f565b6108cb610cc0565b33610bd57f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b0316146108cb5760405163118cdaa760e01b81523360048201526024016102f7565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff166108cb57604051631afcd79f60e31b815260040160405180910390fd5b610b03610c6f565b610b6e610c6f565b80356001600160a01b0381168114610cdf57600080fd5b919050565b60008060408385031215610cf757600080fd5b610d0083610cc8565b946020939093013593505050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610d3557600080fd5b813567ffffffffffffffff80821115610d5057610d50610d0e565b604051601f8301601f19908116603f01168101908282118183101715610d7857610d78610d0e565b81604052838152866020858801011115610d9157600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080600080600060a08688031215610dc957600080fd5b853567ffffffffffffffff80821115610de157600080fd5b610ded89838a01610d24565b96506020880135915080821115610e0357600080fd5b610e0f89838a01610d24565b95506040880135915080821115610e2557600080fd5b610e3189838a01610d24565b94506060880135915080821115610e4757600080fd5b50610e5488828901610d24565b95989497509295608001359392505050565b600060208284031215610e7857600080fd5b5035919050565b6000815180845260005b81811015610ea557602081850181015186830182015201610e89565b506000602082860101526020601f19601f83011685010191505092915050565b8b81526001600160a01b038b16602082015261016060408201819052600090610ef08382018d610e7f565b90508281036060840152610f04818c610e7f565b90508281036080840152610f18818b610e7f565b905082810360a0840152610f2c818a610e7f565b60c0840198909852505060e081019490945261010084019290925215156101208301521515610140909101529695505050505050565b60008060408385031215610f7557600080fd5b82359150610f8560208401610cc8565b90509250929050565b60008060008060808587031215610fa457600080fd5b5050823594602084013594506040840135936060013592509050565b600060208284031215610fd257600080fd5b610fdb82610cc8565b9392505050565b600181811c90821680610ff657607f821691505b60208210810361101657634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561106657600081815260208120601f850160051c810160208610156110435750805b601f850160051c820191505b818110156110625782815560010161104f565b5050505b505050565b815167ffffffffffffffff81111561108557611085610d0e565b611099816110938454610fe2565b8461101c565b602080601f8311600181146110ce57600084156110b65750858301515b600019600386901b1c1916600185901b178555611062565b600085815260208120601f198616915b828110156110fd578886015182559484019460019091019084016110de565b508582101561111b5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60608152600061113e6060830186610e7f565b82810360208401526111508186610e7f565b915050826040830152949350505050565b60006001820161118157634e487b7160e01b600052601160045260246000fd5b506001019056fe9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f00a26469706673582212202ded64bdd198de23ead1d23d04e97c59e0247bbc8ae399ced3c57debdc50f64b64736f6c63430008140033";

type ArtifactMemeContestConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ArtifactMemeContestConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ArtifactMemeContest__factory extends ContractFactory {
  constructor(...args: ArtifactMemeContestConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ArtifactMemeContest & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(
    runner: ContractRunner | null
  ): ArtifactMemeContest__factory {
    return super.connect(runner) as ArtifactMemeContest__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ArtifactMemeContestInterface {
    return new Interface(_abi) as ArtifactMemeContestInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ArtifactMemeContest {
    return new Contract(
      address,
      _abi,
      runner
    ) as unknown as ArtifactMemeContest;
  }
}
