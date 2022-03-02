export type Session = string;

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
  networkId: number;
  value: number | undefined;
};

export type PhononPair = {
  url: string;
};

export enum CurrencyType {
  BTC,
  ETH,
  OTHER,
}

export type DescriptorDTO = {
  index: number;
  currencyType: number;
  value: number;
  sessionId: string;
};

export type DepositRequest = {
  CurrencyType: number;
  Denominations: number[];
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
  Denomination: number;
  CurrencyType: number;
};

export type RedeemPhononDTO = {
  P: PhononDTO;
  RedeemAddress: string;
};
