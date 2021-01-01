import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { Switch, Route } from "react-router-dom";

//import components
import Home from "./Components/Home/Home";

function App() {
  return (
    <div className="App">
      <Switch>
        {/* Clint-Routes */}
        <Route exact path="/" component={Home} />
      </Switch>
    </div>
  );
}

export default App;
