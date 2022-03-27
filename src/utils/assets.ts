import { AssetTypeId, NetworkId, AssetDetails } from "../types";
import { ethers } from "ethers";
// todo move the contracts out of the phonon directory
import { ERC20__factory } from "./phonon/contracts";

export const fetchAssetDetails = async (
  networkId: NetworkId,
  assetType: AssetTypeId,
  contractAddress: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): Promise<AssetDetails> => {
  const erc20 = ERC20__factory.connect(contractAddress, providerOrSigner);

  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    assetType === AssetTypeId.ERC20 ? erc20.decimals() : 0,
  ]);

  return {
    networkId,
    assetTypeId: AssetTypeId.ERC20,
    contractAddress,
    symbol,
    decimals,
  };
};
