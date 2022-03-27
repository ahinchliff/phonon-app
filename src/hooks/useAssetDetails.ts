import { useSelector } from "react-redux";
import { NETWORK_DETAILS } from "../constants/networks";
import { RootState } from "../store";
import { AssetDetails, AssetTypeId, NetworkId } from "../types";

const useAssetDetails = (
  networkId: NetworkId,
  assetTypeId: AssetTypeId,
  contractAddress: string | undefined
): AssetDetails | undefined => {
  const assetDetails = useSelector(
    (state: RootState) => state.assets.assetDetails
  );

  if (assetTypeId === AssetTypeId.Native) {
    const network = NETWORK_DETAILS[networkId];
    return {
      networkId,
      assetTypeId,
      symbol: network.ticker,
      decimals: network.decimals,
    };
  }

  const assetDetail = assetDetails.find(
    (asset) =>
      asset.networkId === networkId &&
      asset.contractAddress?.toLowerCase() === contractAddress?.toLowerCase()
  );

  if (!assetDetail) {
    return;
  }

  return assetDetail;
};

export default useAssetDetails;
