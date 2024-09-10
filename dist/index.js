"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = require("web3");
const zksync_web3_1 = require("zksync-web3");
class ZkSyncContractPaymasterPlugin extends web3_1.Web3PluginBase {
    constructor(_ethereum) {
        super();
        this.pluginNamespace = "zkSyncContractPaymasterPlugin";
        this.ethereum = _ethereum;
    }
    write(address, abi, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new zksync_web3_1.Web3Provider(this.ethereum);
            const signer = provider.getSigner();
            const { from, customData, methodName, args } = options;
            const { gasPerPubdata, paymasterParams } = customData;
            const contract = new zksync_web3_1.Contract(address, abi);
            contract.link(this);
            const tx = yield contract.methods[methodName](...args).send({ from, gasPerPubdata, paymasterParams });
            return tx;
        });
    }
}
exports.default = ZkSyncContractPaymasterPlugin;
