import {
  faBtc,
  faEthereum,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { AssetTypeId, NetworkId, NetworkIdMap } from "../types";

export type NetworkDetails = {
  id: NetworkId;
  icon: IconDefinition;
  ticker: string;
  name: string;
  textColor: string;
  symbol: string;
};

export const NETWORKS: NetworkIdMap<NetworkDetails> = {
  [NetworkId.Unspecified]: {
    id: NetworkId.Unspecified,
    icon: faQuestionCircle,
    ticker: "N/A",
    name: "None",
    textColor: "text-black",
    symbol: "$",
  },
  // [NetworkId.Phonon]: {
  //   id: NetworkId.Phonon,
  //   icon: faQuestionCircle,
  //   ticker: "PH",
  //   name: "Phonon",
  //   textColor: "text-black",
  //   symbol: "p",
  // },
  [NetworkId.Bitcoin]: {
    id: NetworkId.Bitcoin,
    icon: faBtc,
    ticker: "BTC",
    name: "Bitcoin",
    textColor: "text-yellow-200",
    symbol: "฿",
  },
  [NetworkId.Ethereum]: {
    id: NetworkId.Ethereum,
    icon: faEthereum,
    ticker: "ETH",
    name: "Ethereum",
    textColor: "text-indigo-300",
    symbol: "Ξ",
  },
  [NetworkId.EthereumRinkeby]: {
    id: NetworkId.EthereumRinkeby,
    icon: faEthereum,
    ticker: "RETH",
    name: "Ethereum Rinkeby",
    textColor: "text-indigo-300",
    symbol: "RΞ",
  },
};

export const EVM_NETWORKS_TO_CHAIN_ID = {
  [NetworkId.Ethereum]: 1,
  [NetworkId.EthereumRinkeby]: 4,
};

export const SUPPORTED_ASSET_TYPES_BY_NETWORK: NetworkIdMap<AssetTypeId[]> = {
  [NetworkId.Unspecified]: [],
  // [NetworkId.Phonon]: [],
  [NetworkId.Bitcoin]: [AssetTypeId.Native],
  [NetworkId.Ethereum]: [
    AssetTypeId.Native,
    AssetTypeId.ERC20,
    AssetTypeId.ERC721,
  ],
  [NetworkId.EthereumRinkeby]: [
    AssetTypeId.Native,
    AssetTypeId.ERC20,
    AssetTypeId.ERC721,
  ],
};
