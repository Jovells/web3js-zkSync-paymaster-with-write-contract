import { AbiFragment, AbiItem, Web3PluginBase,  } from "web3";
import { Contract, Web3Provider } from "zksync-web3";
import {  types, } from 'web3-plugin-zksync';

declare let window: any;


export default class ZkSyncContractPaymasterPlugin extends Web3PluginBase {
    pluginNamespace = "zkSyncContractPaymasterPlugin";
    ethereum: any;

    constructor(_ethereum: any) {
        super();
        this.ethereum = _ethereum;
    }
    
    async write( address: string, abi: AbiItem [], options: {
        methodName: string, 
        args: any[]
        from: string,
        customData : {
            gasPerPubdata: number,
            paymasterParams: types.PaymasterParams
          }
    } ) {

        const provider = new Web3Provider(this.ethereum);
        const signer = provider.getSigner();

        const { from, customData, methodName, args } = options;
        const { gasPerPubdata, paymasterParams } = customData;
        const contract = new Contract(address, abi, );
        contract.link(this);
        const tx = await contract.methods[methodName](...args).send({ from, gasPerPubdata, paymasterParams });
        return tx;
    }


  
  }