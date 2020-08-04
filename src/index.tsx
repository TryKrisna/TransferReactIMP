import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProviderContextProvider } from "./components/Provider";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./App";
import { TokenRegistryDemo } from "./TokenRegistry";

ReactDOM.render(
  <React.StrictMode>
    <ProviderContextProvider>
      <Router>
        <Switch>
          <Route path="/verify">
            <App />
          </Route>
          <Route path="/token-registry">
            <TokenRegistryDemo />
          </Route>
        </Switch>
      </Router>
    </ProviderContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
