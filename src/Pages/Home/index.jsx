import React, { useState, useEffect } from "react";

export default function Home() {
  // useEffect(() => {

  //  postMessageToListeners({
  //     event:'ready',
  //     data: null
  //   })
  //   postMessageToListeners({event: 'connect.wallet', data: { appOrigin:'http://localhost:5500/popup.html' }})

  //   const payButton = document.getElementById('pay');
  //   const errorDiv = document.getElementById('error');
  //   const successDiv = document.getElementById('success');
  //   const amountDiv = document.getElementById('amount');
  //   const receipientDiv = document.getElementById('receipient');
  //   const connect_walletButton = document.getElementById('connect_wallet');
  //   const balanceDiv = document.getElementById('balance');
  //   const customerAddress = document.getElementById('address');
  //   const blockexplorerDiv = document.getElementById('blockexplorer');
  //   const gasfeeDiv = document.getElementById('gasfee');

  //   connect_walletButton.addEventListener('click', function(){
  //       connect_walletButton.innerHTML = 'Connecting..'
  //     postMessageToListeners({event: 'connect.wallet', data: { appOrigin:'http://localhost:5500/popup.html' }})
  //   })

  //   payButton.disabled = true;

  //   payButton.addEventListener('click', function(){
  //      postMessageToListeners({event: 'send.value', data: { value: 5,appOrigin:'http://localhost:5500' }})
  //   })

  //   window.addEventListener("message",function(event){

  //    if(event.data.type === 'web3connected'){
  //       balanceDiv.innerHTML = `${toEther(event.data.balance,18)} MATIC`
  //       customerAddress.innerHTML = formatAddress(event.data.account)
  //       connect_walletButton.style.display = 'none'
  //       payButton.disabled = false;

  //    }

  //    if(event.data.type === 'transaction.success'){
  //       payButton.innerHTML = 'Pay'
  //       successDiv.innerHTML = 'Payment Successful'
  //    }

  //    if(event.data.type === 'sdkData'){
  //       amountDiv.innerHTML = event.data.config.value;
  //       receipientDiv.innerHTML = formatAddress(event.data.config.recepient)
  //        blockexplorerDiv.href  = `https://mumbai.polygonscan.com/address/${event.data.config.recepient}`
  //    }

  //    if(event.data.type === 'transaction.fee'){
  //      console.log(event.data)
  //      gasfeeDiv.innerHTML = `${event.data.data} MATIC`
  //    }

  //    if(event.data.type === 'error'){

  //    }

  //   })
  // }, [])

  return (
    <section className="payment-form">
      <div className="managedaccount">
        <div className="managedaccount_message">
          <h3>
            Send <span style={{ fontWeight: "bold" }} id="amount"></span>
            <span style={{ fontWeight: "bold" }}> MATIC</span>{" "}
          </h3>
          <div className="managedaccount__details">
            <div className="flex-row">
              <span>Network</span>
              <span style={{ color: "#59b0aa", fontWeight: "bold" }}>
                Polygon Mumbai
              </span>
            </div>
            <div className="flex-row">
              <span>Receipient</span>
              <span>
                <span id="receipient"></span>
                <a target="_blank" id="blockexplorer">
                  <img className="icon" src="./open.png" />
                </a>
              </span>
            </div>
            <div className="flex-row">
              <span>Gas Fee</span>
              <span
                id="gasfee"
                style={{ fontWeight: "bold", color: "#59b0aa" }}
              >
                -- MATIC
              </span>
            </div>
          </div>
        </div>

        <div id="error"></div>
        <div id="success"></div>
      </div>
      <button id="pay" className="btn-outline w-100">
        Pay from wallet
      </button>
    </section>
  );
}
