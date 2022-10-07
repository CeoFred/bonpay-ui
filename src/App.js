import Router from "./router";
import chakraUItheme from "./theme/index.chakra-ui";
import { ChakraProvider } from "@chakra-ui/react";
import Wrapper from "./container/Wrapper";
import { BlockNativeContextProvider } from "./Providers/Web3.provider";
import "./App.css";
import { store } from "./store";
import { Provider } from "react-redux";
import MessageListenerProvider from "./Providers/Message.Listener";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ChakraProvider theme={chakraUItheme}>
          <BlockNativeContextProvider>
            <MessageListenerProvider />
            <Wrapper>
              <Router />
            </Wrapper>
          </BlockNativeContextProvider>
        </ChakraProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
