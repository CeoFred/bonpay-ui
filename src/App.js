import { RouterProvider } from "react-router-dom";
import router from "./router";
import chakraUItheme from "./theme/index.chakra-ui";
import { ChakraProvider } from "@chakra-ui/react";
import Wrapper from "./container/Wrapper";
import { BlockNativeContextProvider } from "./Providers/Web3.provider";
import "./App.css";
import { store } from "./store";
import { Provider } from "react-redux";
import MessageListenerProvider from "./Providers/Message.Listener";

function App() {
  return (
    <Provider store={store}>
      
      <ChakraProvider theme={chakraUItheme}>
        <BlockNativeContextProvider>
          <MessageListenerProvider />
          <Wrapper>
            <RouterProvider router={router} />
          </Wrapper>
        </BlockNativeContextProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
