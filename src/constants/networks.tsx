import { faBtc, faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import BinanceLogo from "../assets/binance_logo.svg";

type Network = {
  icon: React.ReactNode;
  ticker: string;
  name: string;
  color: string;
  symbol: string;
};

export const NETWORKS: Network[] = [
  {
    icon: (
      <FontAwesomeIcon
        icon={faQuestionCircle}
        size="2x"
        className={"text-black"}
      />
    ),
    ticker: "N/A",
    name: "None",
    color: "text-black",
    symbol: "$",
  },
  {
    icon: (
      <FontAwesomeIcon icon={faBtc} size="2x" className={"text-yellow-200"} />
    ),
    ticker: "BTC",
    name: "Bitcoin",
    color: "text-yellow-200",
    symbol: "฿",
  },
  {
    icon: (
      <FontAwesomeIcon
        icon={faEthereum}
        size="2x"
        className={"text-indigo-300"}
      />
    ),
    ticker: "ETH",
    name: "Ethereum",
    color: "text-indigo-300",
    symbol: "Ξ",
  },
  {
    icon: (
      <FontAwesomeIcon
        icon={faQuestionCircle}
        size="2x"
        className={"text-indigo-300"}
      />
    ),
    ticker: "PHONON",
    name: "Native Phonon",
    color: "text-indigo-300",
    symbol: "PH",
  },
  {
    icon: <img src={BinanceLogo} alt="binance-logo" />,
    ticker: "BNB",
    name: "Binance",
    color: "text-yellow-300",
    symbol: "$",
  },
];
