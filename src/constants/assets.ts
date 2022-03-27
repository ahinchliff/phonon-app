import { AssetTypeId, AssetTypeIdMap, NetworkId, NetworkIdMap } from "../types";

export type AssetDetails = {
  id: AssetTypeId;
  name: string;
};

export const ASSETS: AssetTypeIdMap<AssetDetails> = {
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
