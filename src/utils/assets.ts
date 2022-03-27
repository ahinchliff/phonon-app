import { AssetTypeId, NetworkId } from "../types";
import { NATIVE_ASSET_DECIMALS } from "../constants/networks";

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
