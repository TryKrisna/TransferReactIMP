import React, { useState } from "react";
import "./App.css";
import { text } from "@storybook/addon-knobs";

export const App: React.FunctionComponent = () => {
  const [textFieldContents, setTextFieldContents] = useState("");
  return (
    <div>
      <div className="flex content-center  text-lg text-black min-h-screen bg-white-700">
        <div className="w-1/3 ml-auto bg-gray-400 flex content-center justify-center">
          <textarea className="w-9/12 m-6" onChange={(event) => setTextFieldContents(event.target.value)}></textarea>
        </div>
        <div className="w-1/3 mr-auto bg-gray-500 flex item-center content-center justify-center">
          <div className="w-9/12 m-6 text-center">{textFieldContents.length}</div>
        </div>
      </div>
    </div>
  );
};
