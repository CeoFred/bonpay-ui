import { useEffect, useState } from 'react'
import logo from './logo.png';
import './App.css';

function App() {

useEffect(() => {
  

  
 const formatAddress = address => {
  return address.slice(0, 9) + '...' + address.slice(address.length - 4);
};

const toEther = (wei,decimals) => {
  return Number(wei)/10**decimals;
}
  const postMessageToListeners = ({ event, data }) => {
  window.parent && window.parent.postMessage({ type: event, data }, "*");
  };

 window.addEventListener('load', function(){
   postMessageToListeners({
    event:'ready',
    data: null
  })
  postMessageToListeners({event: 'connect.wallet', data: { appOrigin:'http://localhost:5500/popup.html' }})

})

  const payButton = document.getElementById('pay');
  const errorDiv = document.getElementById('error');
  const successDiv = document.getElementById('success');
  const amountDiv = document.getElementById('amount');
  const receipientDiv = document.getElementById('receipient');
  const connect_walletButton = document.getElementById('connect_wallet');
  const balanceDiv = document.getElementById('balance');
  const customerAddress = document.getElementById('address');
  const blockexplorerDiv = document.getElementById('blockexplorer');
  const gasfeeDiv = document.getElementById('gasfee');

  connect_walletButton.addEventListener('click', function(){
      connect_walletButton.innerHTML = 'Connecting..'
    postMessageToListeners({event: 'connect.wallet', data: { appOrigin:'http://localhost:5500/popup.html' }})
  })

  payButton.disabled = true;

  payButton.addEventListener('click', function(){
     postMessageToListeners({event: 'send.value', data: { value: 5,appOrigin:'http://localhost:5500' }})
  })

  window.addEventListener("message",function(event){

   if(event.data.type === 'web3connected'){
      balanceDiv.innerHTML = `${toEther(event.data.balance,18)} MATIC`
      customerAddress.innerHTML = formatAddress(event.data.account)
      connect_walletButton.style.display = 'none'
      payButton.disabled = false;

     
   }

   if(event.data.type === 'transaction.success'){
      payButton.innerHTML = 'Pay'
      successDiv.innerHTML = 'Payment Successful'
   }

   if(event.data.type === 'sdkData'){
      amountDiv.innerHTML = event.data.config.value;
      receipientDiv.innerHTML = formatAddress(event.data.config.recepient)
       blockexplorerDiv.href  = `https://mumbai.polygonscan.com/address/${event.data.config.recepient}`
   }

   if(event.data.type === 'transaction.fee'){
     console.log(event.data)
     gasfeeDiv.innerHTML = `${event.data.data} MATIC`
   }

   if(event.data.type === 'error'){

   }

  })
}, [])


  return (
    <div className="container">
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
                  <a style={{color: "#59b0aa"}} >Wallet</a>
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
              </ul>
            </div>
          </nav>
        </div>
        <div className="checkout_core">
          <header>
            <div className="payment_info">
              <div className="merchant_logo">
                <img src="./logo.png"/>
              </div>
              <div className="customer_info">
                 <button id="connect_wallet">Connect Wallet</button>
                 <div id="address" className="customer_address"></div>
                 <div id="balance" className="customer_balance"></div>

              </div>

            </div>
          </header>
          <div className="checkout_stage">
            <section className="payment-form">
              <div className="managedaccount">
                <div className="managedaccount_message">
                  <h3>Send <span style={{fontWeight: 'bold'}} id="amount"></span><span style={{fontWeight: 'bold'}}> MATIC</span> </h3>
                  <div className="managedaccount__details">
                    <div className="flex-row">
                      <span>Network</span>
                      <span style={{color: "#59b0aa",fontWeight:"bold"}}>Polygon Mumbai</span>
                    </div>
                    <div className="flex-row">
                      <span>Receipient</span>
                      <span><span id="receipient"></span> 
               <a target="_blank" id="blockexplorer"><img className="icon" src="./open.png" /></a></span>
                    </div>
                    <div className="flex-row">
                      <span>Gas Fee</span>
                      <span id="gasfee" style={{fontWeight: 'bold',color: "#59b0aa"}}>-- MATIC</span>
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
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default App;
