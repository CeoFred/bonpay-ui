import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import {
  useConnectWallet,
  useSetChain,
  useWallets,
  init,
} from "@web3-onboard/react";
import { chainConfig } from "../config/chain";
import injectedModule from "@web3-onboard/injected-wallets";
import walletConnectModule from "@web3-onboard/walletconnect";
import coinbaseModule from "@web3-onboard/coinbase";
import blockPayLogo from "../assets/images/logo.png";

const injected = injectedModule();
const coinbase = coinbaseModule();
const walletConnect = walletConnectModule();

const BlockNativeContext = React.createContext({
  onBoard: null,
  provider: null,
  signer: null,
  selectWalletAndVerify: null,
  disconnectWallet: null,
  getWallet: null,
  loaded: false,
  initialize: null,
  connected: false,
});

export const initWeb3Onboard = init({
  wallets: [injected, coinbase, walletConnect],
  chains: [
    {
      id: chainConfig[80001].CHAIN_ID,
      token: chainConfig[80001].CURRENCY_SYMBOL,
      label: chainConfig[80001].NETWORK_NAME,
      rpcUrl: chainConfig[80001].RPC_URLS[0],
    },
  ],
  appMetadata: {
    name: "Block Pay",
    icon: blockPayLogo,
    logo: blockPayLogo,
    description:
      "Receive crypto payments from anywhere around the world, options including native tokens (MATIC, ETHER,BUSD), Tokens (USDT,BUSD), NFTs and more.",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
      { name: "MetaMask", url: "https://metamask.io" },
    ],
    agreement: {
      version: "1.0.0",
      termsUrl: "https://blockpay.org/terms-and-conditions",
    },
    gettingStartedGuide: "https://blockpay.org",
    explore: "https://blockpay.org",
  },
  // accountCenter: {
  //   desktop: {
  //     position: 'bottomLeft',
  //     enabled: true,
  //     minimal: true,
  //   },
  //   mobile: {
  //     position: 'topRight',
  //     enabled: false,
  //     minimal: true,
  //   },
  // },
});

const BlockNativeContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(0);
  const [onBoard, setWeb3Onboard] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [loaded, isLoaded] = useState(false);
  const [{ wallet: _wallet, connecting }, connect, disconnect] =
    useConnectWallet();
  const connectedWallets = useWallets();
  const [nativeBalance, setNativeBalance] = useState(null);

  const [{ chains, connectedChain }, setChain] = useSetChain();

  useEffect(() => {
    setWeb3Onboard(initWeb3Onboard);
  }, []);

  async function switchOrRegisterChain() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainConfig[80001].CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainConfig[80001].CHAIN_ID,
                chainName: chainConfig[80001].NETWORK_NAME,
                rpcUrls: chainConfig[80001].RPC_URLS /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  async function fetchNativeBalance(address, provider) {
    const balance = await provider.getBalance(address);
    setNativeBalance(balance.toString());
    console.log(balance.toString());
    return balance;
  }

  async function connectWallet() {
    await initialize();
    await onBoard.setChain({
      chainId: chainConfig[80001].CHAIN_ID,
    });
    await connect();
    await setConnected(true);
  }

  async function initialize() {
    await switchOrRegisterChain();
    const onboard = initWeb3Onboard;
    await setWeb3Onboard(onboard);
    await isLoaded(true);
    await setWallet(_wallet);
    await setCurrentNetwork(chains);

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets")
    );

    if (previouslyConnectedWallets) {
      // Connect the most recently connected wallet (first in the array)
      await onboard.connectWallet({
        autoSelect: previouslyConnectedWallets[0],
      });
      setConnected(true);
    }
  }

  useEffect(() => {
    try {
      initialize();
    } catch (error) {
      console.log(error);
      formatState();
    }
  }, []);

  useEffect(() => {
    if (!connectedWallets.length) return;

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    );
    window.localStorage.setItem(
      "connectedWallets",
      JSON.stringify(connectedWalletsLabelArray)
    );
    setWallet(connectedWallets[0]);
  }, [connectedWallets, _wallet]);

  useEffect(() => {
    let provider;

    if (!_wallet?.provider) {
      provider = null;
      formatState();
    } else {
      provider = new ethers.providers.Web3Provider(_wallet.provider, "any");
      setProvider(provider);
      console.log(_wallet);
      _wallet &&
        fetchNativeBalance(_wallet.accounts[0].address, provider) &&
        setWallet(_wallet);
    }
  }, [_wallet]);

  useEffect(() => {
    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem("connectedWallets")
    );

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({ autoSelect: previouslyConnectedWallets[0] });
      }
      setWalletFromLocalStorage();
    }
  }, [onBoard, connect]);

  async function disconnectWallet() {
    await window.localStorage.removeItem("connectedWallets");
    _wallet && (await disconnect(_wallet));
    await formatState();
    // window.location.reload();
  }

  function formatState() {
    setWallet(null);
    setSigner(null);
    setProvider(null);
    setConnected(false);
    isLoaded(false);
    setNativeBalance(null);
  }

  const readyToTransact = async () => {
    if (!_wallet) {
      const walletSelected = await connect();
      if (!walletSelected) return false;
    }

    if (connectedChain && connectedChain.id !== chainConfig[80001].CHAIN_ID) {
      await setChain({ chainId: chainConfig[80001].CHAIN_ID });
    }

    return true;
  };

  return (
    <BlockNativeContext.Provider
      value={{
        onBoard,
        provider,
        disconnectWallet,
        wallet,
        readyToTransact,
        currentNetwork,
        loaded,
        connect: connectWallet,
        connected,
        balance: nativeBalance,
        connecting,
      }}
    >
      {children}
    </BlockNativeContext.Provider>
  );
};
export const useBlockNative = () => {
  return useContext(BlockNativeContext);
};

export { BlockNativeContext, BlockNativeContextProvider };
