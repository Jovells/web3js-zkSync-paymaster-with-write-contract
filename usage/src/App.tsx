import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getPaymasterParams, types, Web3ZKsyncL2 } from 'web3-plugin-zksync';
import dchain from "./dchain.json";
import dchainAbi from './dchainAbi';
import ZkSyncContractPaymasterPlugin from "./ZkSyncContractPaymasterPlugin";


declare let window: any;

const App = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== 'undefined') {

        // Request account access
         await window.ethereum.request({ method: 'eth_requestAccounts' });


        // Create Web3 instance
        const l1='https://eth-sepolia.g.alchemy.com/v2/VCOFgnRGJF_vdAY2ZjgSksL6-6pYvRkz'
        const l2=Web3ZKsyncL2.initWithDefaultProvider(types.Network.Sepolia)
          const web3 = new Web3(window.ethereum);
          web3.registerPlugin(new ZkSyncContractPaymasterPlugin(window.ethereum));
          // Initialize zkSync

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log('Accounts:', accounts);
        setWeb3(web3);


      }
    };

    initializeWeb3();
  },[account]);

  const writeToContract = async () => {
    if (!web3 ) return;

    const shipmentDetails = {
        shipmentType: 0, // Public
        origin: "Boston",
        destination: "Seattle",
        supplier: "0x8A8A5F98257de83F5D988c9ABa8328a2a32c0dD1",
        transporter: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        retailer: "0x98e9C3Ad0A274Cc3CE9F23997AF4499Dfc4d9769",
        paymentType: 0, // Escrowed
        amount: 100,
        data: web3.utils.padLeft('0x0', 64),
      };
  

    try {

      //@ts-ignore
      const tx = await web3.zkSyncContractPaymasterPlugin.write( dchain.address, dchainAbi,  {
        methodName: "createShipment", 
        args: [shipmentDetails],
        from: account,
        customData : {
            gasPerPubdata: 50000,
            paymasterParams: getPaymasterParams('0xd851E8cDca408A80691255F823F76C057b08ccCc', {
              type: "General",
              innerInput: new Uint8Array(),
            }),
          }
    } )
    
    
      console.log('Transaction receipt:', tx);
    } catch (error) {
      console.error('Error writing to contract:', error);
    }
  };

  return <>
      <h1>zkSync dApp using Web3 Plugin</h1>
      {account && <p>Connected Account: {account}</p>}
      <button onClick={writeToContract}>Write to Contract</button>
    </>
  
};



export default App;