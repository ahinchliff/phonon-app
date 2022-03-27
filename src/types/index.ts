export type Session = string;
export type Eth = string | number;
export type Wei = string | number;

export enum NetworkId {
  Unspecified,
  // Phonon,
  Bitcoin,
  Ethereum,
  EthereumRinkeby,
}

export type NetworkIdMap<T> = { [key in NetworkId]: T };

export enum AssetTypeId {
  Native,
  ERC20,
  ERC721,
}

export type AssetTypeIdMap<T> = { [key in AssetTypeId]: T };

export type CreatePhononResponse = {
  index: number;
  pubKey: string;
};

export type Phonon = {
  index: number;
  pubKey: string;
  type: number;
  value: number;
};

export type NetworkValue = {
  networkId: NetworkId;
  value: number | undefined;
};

export type PhononPair = {
  url: string;
};

export type DescriptorDTO = {
  index: number;
  assetType: AssetTypeId;
  value: number;
  sessionId: string;
};

export type Tag = { TagName: string; TagValue: string };

export type DepositRequest = {
  CurrencyType: number; // todo - make stricter
  Denominations: Wei[];
  Tags?: Tag[][];
};

export type DepositConfirmation = {
  Phonon: PhononDTO;
  ConfirmedOnChain: boolean;
  ConfirmedOnCard: boolean;
}[];

export type PhononDTO = {
  KeyIndex: number;
  PubKey: string;
  Address: string;
  AddressType: number;
  SchemaVersion: number;
  ExtendedSchemaVersion: number;
  Denomination: string;
  CurrencyType: NetworkId; // suggestion - name this property NetworkId
  ChainID: AssetTypeId; // suggestion - name this property AssetTypeId
  ExtendedTLV: Tag[];
};

export type RedeemPhononDTO = {
  P: PhononDTO;
  RedeemAddress: string;
};

export type NewPhonon = {
  denomination: string;
  tags?: Tag[];
};

type AssetDetailsBase = {
  networkId: NetworkId;
  assetTypeId: AssetTypeId;
  contractAddress: string;
  symbol: string;
};

export type ERC20Details = AssetDetailsBase & {
  decimals: number;
};
export type ERC721Details = AssetDetailsBase;
export type AssetDetails = ERC20Details | ERC721Details;
