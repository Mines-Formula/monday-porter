console.log("mondaySdk global:", window.mondaySdk);

import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";

const el = document.getElementById("root");
const root = createRoot(el);

root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);