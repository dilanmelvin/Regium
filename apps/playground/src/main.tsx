import { createRegium } from "@regium/core";
import { allCountries } from "@regium/countries";
import { RegiumProvider } from "@regium/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const regium = createRegium({ plugins: allCountries });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RegiumProvider regium={regium}>
      <App />
    </RegiumProvider>
  </React.StrictMode>,
);
