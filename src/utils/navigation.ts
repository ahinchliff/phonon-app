import { AssetTypeId, NetworkId } from "../types";

type NetworkIdParam = NetworkId | string;
type AssetIdParam = AssetTypeId | string;

export const getNetworkListPath = (sessionId: string) => `/${sessionId}`;

export const getPhononListPath = (
  sessionId: string,
  networkId: NetworkIdParam,
  assetId: AssetIdParam
) => `/${sessionId}/${networkId}/${assetId}`;

export const getCreatePath = (
  sessionId: string,
  networkId: NetworkIdParam,
  assetId: AssetIdParam
) => `/${sessionId}/${networkId}/${assetId}/create`;

export const getRedeemPath = (
  sessionId: string,
  networkId: NetworkIdParam,
  assetId: AssetIdParam
) => `/${sessionId}/${networkId}/${assetId}/redeem`;
