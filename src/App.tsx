import React, { useState, useEffect } from "react";
import "./App.css";
import { verify, isValid } from "@govtechsg/oa-verify";

export const App: React.FunctionComponent = () => {
  const [textFieldContents, setTextFieldContents] = useState("");
  const [verificationResults, setVerificationResults] = useState("Nothing Here Yet");
  useEffect(() => {
    async function verifyDocument() {
      try {
        setVerificationResults(
          JSON.stringify(isValid(await verify(JSON.parse(textFieldContents), { network: "ropsten" })))
        );
        console.log(verificationResults);
      } catch (e) {
        setVerificationResults("Invalid JSON");
      }
    }
    verifyDocument();
  }, [textFieldContents]);
  return (
    <div>
      <div className="flex content-center  text-lg text-black min-h-screen bg-white-700">
        <div className="w-1/3 ml-auto bg-gray-400 flex content-center justify-center">
          <textarea className="w-9/12 m-6" onChange={(event) => setTextFieldContents(event.target.value)}></textarea>
        </div>
        <div className="w-1/3 mr-auto bg-gray-500 flex item-center content-center justify-center">
          <pre className="w-9/12 m-6 text-left">{verificationResults}</pre>
        </div>
      </div>
    </div>
  );
};
