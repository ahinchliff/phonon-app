import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonAvatar, IonItem, IonLabel, IonSpinner } from "@ionic/react";
import { ethers } from "ethers";
import React from "react";
import { NETWORK_DETAILS } from "../constants/networks";
import { TAGS } from "../constants/tags";
import useAssetDetails from "../hooks/useAssetDetails";
import "../index.css";
import { AssetTypeId, PhononDTO } from "../types";
import { abbreviateHash } from "../utils/addresses";
import { getTagValue } from "../utils/phonon/phonon-general";

const PhononListItem: React.FC<{ phonon: PhononDTO }> = ({ phonon }) => {
  const network = NETWORK_DETAILS[phonon.CurrencyType];

  const contractAddress = getTagValue(phonon, TAGS.contractAddress);
  const tokenId = getTagValue(phonon, TAGS.tokenId);

  const assetDetails = useAssetDetails(
    network.id,
    phonon.ChainID,
    contractAddress
  );

  const label = !assetDetails
    ? undefined
    : assetDetails.assetTypeId === AssetTypeId.ERC721
    ? `#${tokenId || ""} ${assetDetails.symbol}`
    : `${ethers.utils.formatUnits(
        ethers.BigNumber.from(phonon.Denomination),
        assetDetails.decimals
      )} ${assetDetails.symbol}`;

  return (
    <IonItem>
      <IonAvatar slot="start">
        <FontAwesomeIcon
          icon={network.icon}
          size="2x"
          className={network.textColor}
        />
      </IonAvatar>
      <IonLabel>
        <h2>{label || <IonSpinner />}</h2>
        <p>{abbreviateHash(phonon.PubKey)}</p>
      </IonLabel>
    </IonItem>
  );
};

export default PhononListItem;
