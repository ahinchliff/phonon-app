import { AssetTypeId, NetworkId, AssetDetails, ERC20Details } from "../types";
import { NATIVE_ASSET_DECIMALS } from "../constants/networks";
import { ethers } from "ethers";
// todo move the contracts out of the phonon directory
import { ERC20__factory } from "./phonon/contracts";

export const getAssetDecimals = (
  networkId: NetworkId,
  assetTypeId: AssetTypeId
): number => {
  if (assetTypeId === AssetTypeId.ERC721) {
    return 0;
  }

  if (assetTypeId === AssetTypeId.ERC20) {
    // not yet implemented
    return 18;
  }

  return NATIVE_ASSET_DECIMALS[networkId];
};

export const fetchTokenDetails = async (
  networkId: NetworkId,
  contractAddress: string,
  providerOrSigner: ethers.providers.Provider | ethers.Signer
): Promise<ERC20Details> => {
  const erc20 = ERC20__factory.connect(contractAddress, providerOrSigner);

  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);

  return {
    networkId,
    assetTypeId: AssetTypeId.ERC20,
    contractAddress,
    symbol,
    decimals,
  };
};
