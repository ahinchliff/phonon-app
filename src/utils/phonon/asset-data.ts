import { ethers } from "ethers";
import { ERC20__factory } from "./contracts";

export type TokenDetails = {
  symbol: string;
  decimals: number;
};

export const fetchTokenDetails = async (
  contractAddress: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): Promise<TokenDetails> => {
  const erc20 = ERC20__factory.connect(contractAddress, providerOrSigner);

  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);

  return {
    symbol,
    decimals,
  };
};
