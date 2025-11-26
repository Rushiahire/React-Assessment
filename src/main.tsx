import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      {" "}
      {/* Provider MUST wrap the whole app */}
      <App />
    </Provider>
  </React.StrictMode>
);
