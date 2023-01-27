import * as React from 'react'
import { Reset } from 'styled-reset'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <React.Fragment>
          <Reset />
          <div>Hi, I'm an app!</div>
        </React.Fragment>
      </header>
    </div>
  );
}

export default App;
