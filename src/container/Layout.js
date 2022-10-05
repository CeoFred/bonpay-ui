import React, { useState, useEffect } from "react";
import { Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { FaHeart } from 'react-icons/fa'

import Button from "../components/Button";
import { useBlockNative } from "../Providers/Web3.provider";
import { formatAddress, toEther, postMessageToListeners } from "../utils/helpers";
import { useSelector } from "react-redux";
import { selectNetwork } from "../reducers/network/selector";
import {
  walletConnected,
  toggleConnectingWallet,
} from "../reducers/wallet/walletSlice";
import { useAppDispatch } from "../store";
import {Text} from "@chakra-ui/react";
export default function Layout({ children }) {
  const networkState = useSelector(selectNetwork);

  const dispatch = useAppDispatch();

  const { connecting, connected, wallet, balance, connect, readyToTransact } =
    useBlockNative();

  const [account, setAccount] = useState({
    balance,
    address: "0x0",
  });

  useEffect(() => {
    wallet &&
      setAccount((prev) => ({
        ...prev,
        address: formatAddress(wallet.accounts[0]?.address),
        balance: balance ? toEther(balance, 18) : 0,
      }));

    wallet &&
      dispatch(
        walletConnected({
          address: wallet.accounts[0]?.address,
          balance: balance ? toEther(balance, 18) : 0,
        })
      );
  }, [wallet, balance]);

  async function connectWallet() {
    dispatch(toggleConnectingWallet());
    const ready = await readyToTransact();
    ready && (await connect(networkState.NETWORK_ID));
  }


  async function closeBondPay(){
     postMessageToListeners({
      event: "pay.exit",
      data: {completed:false,action:'user'}
    });
  }

  return (
    <div className="container">
      <CloseIcon cursor={"pointer"} color="#fff" mb="15px" onClick={closeBondPay}/>
      <div className="card">
        <div className="checkout">
          <div className="checkout_nav">
            <nav className="nav">
              <div>
                <div className="nav_welcome_message">
                  <header>
                    <div className="welcome-message desktop-only">
                      <h3>Pay With</h3>
                    </div>
                  </header>
                </div>
                <ul className="nav_items">
                  <li>
                    <a className="text-primary">Wallet</a>
                  </li>
                  <li>
                    <a>NFT</a>
                  </li>
                  <li>
                    <a>ERC20-Token</a>
                  </li>
                  <li>
                    <a>Transfer</a>
                  </li>
                  <li>
                    <a>Bridge</a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          <div className="checkout_core">
            <header>
              <div className="payment_info">
                <div className="merchant_logo">
                  <img src="./logo.png" />
                </div>
                <div className="customer_info">
                  {!connected ? (
                    <Button
                      onClick={connectWallet}
                      disabled={connecting}
                      className="btn-primary"
                      id="connect_wallet"
                    >
                      {connecting ? "Connecting.." : "Connect Wallet"}
                    </Button>
                  ) : (
                    <>
                      <div className="customer_address">{account.address}</div>
                      <div className="customer_balance">
                        {networkState.CURRENCY_SYMBOL} {account.balance}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </header>
            <div className="checkout_stage">{children}</div>
          </div>
        </div>
      </div>

      <Text my="10px" color="#fff">Made with <Icon color="red" as={FaHeart} /> by <a target="_blank" rel="noreferrer" href="https://twitter.com/codemon_">codemon_</a>
      </Text>
    </div>
  );
}
