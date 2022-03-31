import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { ethers } from "ethers";
import React from "react";
import { useParams } from "react-router";
import { ASSET_TYPES } from "../constants/assets";
import { NETWORK_DETAILS } from "../constants/networks";
import useAssetDetails from "../hooks/useAssetDetails";
import "../index.css";
import { NetworkId, AssetTypeId as AssetTypeId } from "../types";
import { getPhononListPath } from "../utils/navigation";

export type Props = {
  networkId: NetworkId;
  assetTypeId: AssetTypeId;
  contractAddress?: string | undefined;
  value: string | undefined;
};

const NetworkListItem: React.FC<Props> = ({
  networkId,
  assetTypeId,
  contractAddress,
  value,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const network = NETWORK_DETAILS[networkId];
  const assetDetails = useAssetDetails(networkId, assetTypeId, contractAddress);

  const displayValue =
    value &&
    (assetTypeId === AssetTypeId.ERC721
      ? ethers.utils.formatUnits(value, "0")
      : assetDetails && ethers.utils.formatUnits(value, assetDetails.decimals));

  return (
    <IonItem routerLink={getPhononListPath(sessionId, networkId, assetTypeId)}>
      <IonAvatar slot="start">
        <FontAwesomeIcon
          icon={network.icon}
          size="2x"
          className={network.textColor}
        />
      </IonAvatar>
      <IonLabel>
        <IonText color="light">
          <h1 className="text-xl">
            {!displayValue ? <IonSpinner /> : displayValue}{" "}
            {assetDetails?.symbol}
          </h1>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

export default NetworkListItem;
