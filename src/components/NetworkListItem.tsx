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
import { ASSETS } from "../constants/assets";
import { NETWORKS } from "../constants/networks";
import "../index.css";
import { NetworkId, AssetTypeId as AssetTypeId } from "../types";
import { weiToEth } from "../utils/denomination";
import { getPhononListPath } from "../utils/navigation";

export type Props = {
  networkId: NetworkId;
  assetId: AssetTypeId;
  value: ethers.BigNumber;
  isLoading: boolean;
};

const NetworkListItem: React.FC<Props> = ({
  networkId,
  assetId,
  value,
  isLoading,
}) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const network = NETWORKS[networkId];
  const asset = ASSETS[assetId];
  const label = weiToEth(value?.toString() ?? "0");

  return (
    <IonItem routerLink={getPhononListPath(sessionId, networkId, assetId)}>
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
            {isLoading ? <IonSpinner /> : label} {network.ticker} {asset.name}
          </h1>
        </IonText>
      </IonLabel>
    </IonItem>
  );
};

export default NetworkListItem;
