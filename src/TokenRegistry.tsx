import React, { useState, useEffect } from "react";
import "./App.css";
import { useProviderContext } from "./components/Provider";

export const TokenRegistryDemo: React.FunctionComponent = () => {
  const [textFieldContents, setTextFieldContents] = useState("");
  const { provider, upgradeProvider, isUpgraded } = useProviderContext();

  useEffect(() => {  // This runs when provider or isUpgraded has changed states
    console.log(provider);
    if (isUpgraded) {
      console.log("Upgraded Provider to Signer!");
    }
  }, [provider, isUpgraded]);

  return (
    <div>
      <div className="flex content-center  text-lg text-black min-h-screen bg-white-700">
        <div className="w-1/3 ml-auto bg-gray-400 flex content-center justify-center">
          <textarea className="w-9/12 m-6" value={textFieldContents}></textarea>
        </div>
        <div className="w-1/3 flex mr-auto bg-gray-500 flex item-center content-center justify-center">
            <button
              className="w-full h-16 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={upgradeProvider}
            >
              connect metamask
            </button>
        </div>
      </div>
    </div>
  );
};
