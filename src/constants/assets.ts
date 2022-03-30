import { AssetTypeId, AssetTypeIdMap } from "../types";

export type AssetTypeDetails = {
  id: AssetTypeId;
  name: string;
};

export const ASSET_TYPES: AssetTypeIdMap<AssetTypeDetails> = {
  [AssetTypeId.Native]: {
    id: AssetTypeId.Native,
    name: "Native",
  },
  [AssetTypeId.ERC20]: {
    id: AssetTypeId.ERC20,
    name: "Token",
  },
  [AssetTypeId.ERC721]: {
    id: AssetTypeId.ERC721,
    name: "NFT",
  },
};
