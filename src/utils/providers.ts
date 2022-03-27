import { ethers } from "ethers";
import config from "../config";
import { NetworkId } from "../types";

export const getProvider = (
  networkId: NetworkId
): ethers.providers.JsonRpcProvider | undefined => {
  const RPCS = {
    [NetworkId.Ethereum]: config.ethereumRPC,
    [NetworkId.EthereumRinkeby]: config.ethereumRinkebyRPC,
  };

  const rpc = RPCS[networkId];

  if (!rpc) {
    console.log("No RPC for network");
    return;
  }

  return new ethers.providers.JsonRpcProvider(rpc);
};
