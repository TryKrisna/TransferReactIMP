import React, { useState, useEffect } from "react";
import "./App.css";
import { useProviderContext } from "./components/Provider";
import { useContractFunctionHook } from "@govtechsg/ethers-contract-hook"; // utility library for creating react hooks for smart contracts
import { TitleEscrowCreatorFactory, TradeTrustERC721Factory, TitleEscrowFactory } from "@govtechsg/token-registry";
import { TitleEscrowCreator } from "@govtechsg/token-registry/dist/ts/contracts/TitleEscrowCreator"; // this is a smart contract that deploys TitleEscrows
import { TradeTrustERC721 } from "@govtechsg/token-registry/dist/ts/contracts/TradeTrustERC721";
import { TitleEscrow } from "@govtechsg/token-registry/dist/ts/contracts/TitleEscrow";

const TOKEN_REGISTRY_ADDRESS = "0xb29cc51e2e848c00eb8e1f06a94c8564de136e7c";
const TITLE_ESCROW_CREATOR_ADDRESS = "0xa51B8dAC076d5aC80507041146AC769542aAe195";
const BENEFICIARY_ADDRESS = "0x123B86fC8FCE13c4A0f452Cd0A8AB5b6b3e3A4f3";
const HOLDER_ADDRESS = "0x123B86fC8FCE13c4A0f452Cd0A8AB5b6b3e3A4f3";

export const TokenRegistryDemo: React.FunctionComponent = () => {
  const [textFieldContents, setTextFieldContents] = useState("");
  const [transferTarget, setTransferTarget] = useState("");
  const { provider, upgradeProvider, isUpgraded } = useProviderContext();
  const [titleEscrowCreator, setTitleEscrowCreator] = useState<TitleEscrowCreator | undefined>(undefined);
  const [titleEscrow, setTitleEscrow] = useState<TitleEscrow | undefined>(undefined);
  const [tokenRegistry, setTokenRegistry] = useState<TradeTrustERC721 | undefined>(undefined);

  useEffect(() => {
    // This runs when provider or isUpgraded has changed states
    console.log(provider);
    if (isUpgraded) {
      console.log("Upgraded Provider to Signer!");
    }
  }, [provider, isUpgraded]);

  // before we can use TitleEscrowCreator we must connect to it
  // we cannot connect to it before we upgrade to signer because signer is required for deployment
  const handleConnectToTitleEscrowCreator = () => {
    try {
      const factory = TitleEscrowCreatorFactory.connect(TITLE_ESCROW_CREATOR_ADDRESS, provider);
      setTitleEscrowCreator(factory);
      console.log("Connected to Title Escrow Creator!");
    } catch (e) {
      console.error(e);
    }
  };

  // useContractFunctionHook helps to create methods to interact with ethereum smart contracts
  const deployNewTitleEscrow = useContractFunctionHook(titleEscrowCreator, "deployNewTitleEscrow");

  const handleDeployNewTitleEscrow = () => {
    try {
      deployNewTitleEscrow.send(TOKEN_REGISTRY_ADDRESS, BENEFICIARY_ADDRESS, HOLDER_ADDRESS); // TitleEscrowCreator smart contract to deploy
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnectToTitleEscrow = (titleEscrowAddress: string) => {
    titleEscrowAddress ? setTitleEscrow(TitleEscrowFactory.connect(titleEscrowAddress, provider)) : console.error("Need title escrow address!");
    console.log("Connected to TitleEscrow!", titleEscrowAddress, titleEscrow?.address)
  }

  useEffect(() => { // called when deployNewTitleEscrow.state changes
    setTextFieldContents(textFieldContents + "\n" + deployNewTitleEscrow.state);
    if (deployNewTitleEscrow.error) {
      console.error("error", deployNewTitleEscrow.errorMessage);
    } else if (deployNewTitleEscrow.state === "CONFIRMED" && deployNewTitleEscrow.receipt && deployNewTitleEscrow.events) {
      const titleEscrowDeployedLog = deployNewTitleEscrow.events.find(
        (event) => event.event === "TitleEscrowDeployed"
      )
      if (titleEscrowDeployedLog && titleEscrowDeployedLog.args) {
        handleConnectToTitleEscrow(titleEscrowDeployedLog.args[0]) // deployed address is in the first arg, alternatively call .escrowAddress
      }
      console.log("receipt", deployNewTitleEscrow.receipt);
    }
  }, [deployNewTitleEscrow.state, deployNewTitleEscrow.receipt]);

  // before we can use TokenRegistry we must connect to it
  const handleConnectToTokenRegistry = () => {
    try {
      const factory = TradeTrustERC721Factory.connect(TOKEN_REGISTRY_ADDRESS, provider);
      setTokenRegistry(factory);
      console.log("Connected to Token Registry!", factory.address);
    } catch (e) {
      console.error(e);
    }
  };

  const mintToTitleEscrow = useContractFunctionHook(tokenRegistry, "safeMint")

  const handleMintToTitleEscrow = (titleEscrowAddress: string) => {
    let randomTokenId = `0x${BigInt(Math.floor(Math.random() * 1000000000000)).toString(16)}`
    try {
      console.log(titleEscrowAddress, randomTokenId)
      mintToTitleEscrow.send(titleEscrowAddress, randomTokenId, []) // safeMint is necessary as mint cannot send to a smart contract
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { // called when mintToTitleEscrow.state changes
    setTextFieldContents(textFieldContents + "\n" + mintToTitleEscrow.state);
    if (mintToTitleEscrow.error) {
      console.error("error", mintToTitleEscrow.errorMessage);
    }
  }, [mintToTitleEscrow.state]);

  const transferToTarget = useContractFunctionHook(titleEscrow, "transferTo");

  const handleTransferToTarget = (targetAddress: string) => {
    transferToTarget.send(targetAddress);
  };

  useEffect(() => {
    // called when transferToTarget.state changes
    setTextFieldContents(textFieldContents + "\n" + transferToTarget.state);
    if (transferToTarget.error) {
      console.error("error", transferToTarget.errorMessage);
    }
  }, [transferToTarget.state]);

  return (
    <div>
      <div className="flex content-center  text-lg text-black min-h-screen bg-white-700">
        <div className="w-1/3 ml-auto bg-gray-400 flex content-center justify-center">
          <textarea className="w-9/12 m-6" value={textFieldContents}></textarea>
        </div>
        <div className="w-1/3 flex flex-col mr-auto bg-gray-500 flex item-center content-center justify-center">
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={upgradeProvider}
          >
            connect metamask
          </button>
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={handleConnectToTitleEscrowCreator}
          >
            connect to TitleEscrowCreator
          </button>
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={handleDeployNewTitleEscrow}
          >
            deploy title escrow
          </button>
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={handleConnectToTokenRegistry}
          >
            connect to TokenRegistry
          </button>
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => handleMintToTitleEscrow(titleEscrow?.address ?? "")}
          >
            mint to title escrow
          </button>
          <input
            className="w-5/6 mx-auto my-2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="target address..."
            onChange={(event) => setTransferTarget(event.target.value)}
          ></input>
          <button
            className="w-5/6 mx-auto my-2 auto h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
            onClick={() => handleTransferToTarget(transferTarget)}
          >
            transfer to target
          </button>
        </div>
      </div>
    </div>
  );
};
