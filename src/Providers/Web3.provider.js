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
		 {
      id: chainConfig[39797].CHAIN_ID,
      token: chainConfig[39797].CURRENCY_SYMBOL,
      label: chainConfig[39797].NETWORK_NAME,
      rpcUrl: chainConfig[39797].RPC_URLS[0],
    },
		{
      id: chainConfig[56].CHAIN_ID,
      token: chainConfig[56].CURRENCY_SYMBOL,
      label: chainConfig[56].NETWORK_NAME,
      rpcUrl: chainConfig[56].RPC_URLS[0],
    },
		{
      id: chainConfig[1].CHAIN_ID,
      token: chainConfig[1].CURRENCY_SYMBOL,
      label: chainConfig[1].NETWORK_NAME,
      rpcUrl: chainConfig[1].RPC_URLS[0],
    },
			{
      id: chainConfig[5].CHAIN_ID,
      token: chainConfig[5].CURRENCY_SYMBOL,
      label: chainConfig[5].NETWORK_NAME,
      rpcUrl: chainConfig[5].RPC_URLS[0],
    },
			{
      id: chainConfig[42].CHAIN_ID,
      token: chainConfig[42].CURRENCY_SYMBOL,
      label: chainConfig[42].NETWORK_NAME,
      rpcUrl: chainConfig[42].RPC_URLS[0],
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

  async function switchOrRegisterChain(CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainConfig[CHAIN_ID].CHAIN_ID }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainConfig[CHAIN_ID].CHAIN_ID,
                chainName: chainConfig[CHAIN_ID].NETWORK_NAME,
                rpcUrls: chainConfig[CHAIN_ID].RPC_URLS /* ... */,
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

  async function connectWallet(CHAIN_ID) {

    await initialize();
    await connect();
    await setConnected(true);
		await switchOrRegisterChain(CHAIN_ID)
		await onBoard.setChain({
      chainId: chainConfig[CHAIN_ID].CHAIN_ID,
    });
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

		return onboard;
  }

	async function transferNativeToken(ether,receipient){
		const txn =  await signer.sendTransaction({
  			to: receipient,
  			value: ethers.utils.parseEther(ether)
     })
		 return txn;
	}


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
			setSigner(provider.getSigner());
      _wallet &&
        fetchNativeBalance(_wallet.accounts[0].address, provider) &&
        setWallet(_wallet);
    }
  }, [_wallet]);

  // useEffect(() => {
  //   const previouslyConnectedWallets = JSON.parse(
  //     window.localStorage.getItem("connectedWallets")
  //   );
  //   async function setWalletFromLocalStorage() {
  //     await connect({ autoSelect: previouslyConnectedWallets[0] });
  //   }
  //   if (previouslyConnectedWallets?.length) {
  //     setWalletFromLocalStorage();
  //   }
  // }, [onBoard, connect]);

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
				transferNativeToken
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
