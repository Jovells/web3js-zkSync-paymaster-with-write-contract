# ZkSyncContractPaymasterPlugin

`ZkSyncContractPaymasterPlugin` is a plugin that integrates zkSync with Web3 to allow seamless interaction with zkSync smart contracts using paymaster parameters. This plugin simplifies transaction signing and management with custom paymaster parameters, making it easy to work with zkSync-compatible dApps.

## Installation

To use the plugin, first, install the required dependencies:

```bash
npm install web3 web3-plugin-zksync zksync-web3-contract-paymaster-plugin
```

## Usage

Here’s a simple example of how to integrate the plugin into your dApp:

### 1. Import the Plugin

First, import the necessary packages and the `ZkSyncContractPaymasterPlugin` into your project:

```typescript
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ZkSyncContractPaymasterPlugin from 'zksync-web3-contract-paymaster-plugin';
import { getPaymasterParams, types, Web3ZKsyncL2 } from 'web3-plugin-zksync';

declare let window: any;
```

### 2. Initialize Web3 and the Plugin

Create a `useEffect` hook to initialize Web3 and register the zkSync plugin:

```typescript
const App = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3 = new Web3(window.ethereum);
        web3.registerPlugin(new ZkSyncContractPaymasterPlugin(window.ethereum));
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3);
      }
    };

    initializeWeb3();
  }, []);
```

### 3. Write to the Contract

You can now use the plugin to interact with smart contracts. Here’s an example of writing a simple data value to a contract:

```typescript
const writeToContract = async () => {
  if (!web3 || !account) return;

  const contractAddress = "0xYourContractAddress";
  const contractAbi = [
    // ABI of the contract
    {
      "constant": false,
      "inputs": [
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "setValue",
      "outputs": [],
      "type": "function"
    }
  ];

  const valueToWrite = 42;

  try {
    const tx = await web3.zkSyncContractPaymasterPlugin.write(contractAddress, contractAbi, {
      methodName: "setValue",
      args: [valueToWrite],
      from: account,
      customData: {
        gasPerPubdata: 50000,
        paymasterParams: getPaymasterParams('0xYourPaymasterAddress', {
          type: "General",
          innerInput: new Uint8Array(),
        }),
      },
    });

    console.log('Transaction successful:', tx);
  } catch (error) {
    console.error('Error writing to contract:', error);
  }
};
```

### 4. UI Integration

Here’s a simple UI that connects a user account and lets them interact with the contract:

```typescript
  return (
    <div>
      <h1>zkSync dApp Example</h1>
      {account && <p>Connected Account: {account}</p>}
      <button onClick={writeToContract}>Write to Contract</button>
    </div>
  );
};

export default App;
```

### 5. Deploy the Plugin

To deploy this plugin with your dApp, bundle your project using a build tool like Webpack or Vite and ensure you’ve included the required dependencies.

---

## License

This project is licensed under the MIT License.
