import { useParams } from "react-router";
import { AssetDetails, ASSETS } from "../constants/assets";
import { AssetTypeId } from "../types";

const useAsset = (): AssetDetails => {
  const { assetId: assetIdParam } = useParams<{
    assetId: string;
  }>();
  const assetId = parseInt(assetIdParam) as AssetTypeId;
  const assetDetails = ASSETS[assetId];

  if (!assetDetails) {
    throw Error("No asset found");
  }

  return assetDetails;
};

export default useAsset;
