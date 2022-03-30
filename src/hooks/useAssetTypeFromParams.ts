import { useParams } from "react-router";
import { AssetTypeDetails, ASSET_TYPES } from "../constants/assets";
import { AssetTypeId } from "../types";

const useAssetTypeFromParams = (): AssetTypeDetails => {
  const { assetId: assetIdParam } = useParams<{
    assetId: string;
  }>();
  const assetId = parseInt(assetIdParam) as AssetTypeId;
  const assetDetails = ASSET_TYPES[assetId];

  if (!assetDetails) {
    throw Error("No asset found");
  }

  return assetDetails;
};

export default useAssetTypeFromParams;
