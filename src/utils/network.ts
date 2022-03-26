import { EVM_NETWORKS_TO_CHAIN_ID } from "../constants/networks";
import { NetworkId } from "../types";

export const isEVMChain = (networkId: NetworkId) =>
  Object.keys(EVM_NETWORKS_TO_CHAIN_ID).map(Number).includes(networkId);
