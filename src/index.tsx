import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./App";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/verify">
          <App />
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
