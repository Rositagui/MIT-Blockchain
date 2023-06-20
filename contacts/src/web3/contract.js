import web3 from "./web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './config';

// Instantiate smart contract using ABI and address.
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

export default contract;