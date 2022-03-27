import { useSelector } from "react-redux";
import { RootState } from "../store";
import { NetworkId } from "../types";

const useAssetDetails = (networkId: NetworkId, contractAddress: string) => {
  const assetDetails = useSelector(
    (state: RootState) => state.assets.assetDetails
  );

  return assetDetails.find(
    (asset) =>
      asset.networkId === networkId && asset.contractAddress === contractAddress
  );
};

export default useAssetDetails;
