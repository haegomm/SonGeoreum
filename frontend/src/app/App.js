import * as React from "react";
import { Reset } from "styled-reset";

import Game from "../features/game/openVidu/test";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <React.Fragment>
          <Reset />
          <div>Hi, I'm an app!</div>
          <div>open</div>
          <Game />
        </React.Fragment>
      </header>
    </div>
  );
}

export default App;
