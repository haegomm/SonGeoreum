import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

import Reducer from "./app/store";

import App from "./app/App";
import reportWebVitals from "./reportWebVitals";

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      {/* Provider를 이용해 리덕스 적용 */}
      <Provider
        store={createStoreWithMiddleware(
          Reducer,
          /*{ 크롬 브라우저에서 디버깅 도구를 이용할 수 있도록 하는 도구 }*/
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
        )}
      >
      <App />
      </Provider>
  </React.StrictMode>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();