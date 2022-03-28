import {
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { ethers } from "ethers";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import NetworkListItem, {
  Props as NetworkListItemProps,
} from "../components/NetworkListItem";
import {
  NETWORK_DETAILS,
  SUPPORTED_ASSET_TYPES_BY_NETWORK,
} from "../constants/networks";
import useSessionDisplayName from "../hooks/useSessionDisplayName";
import { useFetchPhononsQuery } from "../store/api";
import { AssetTypeId } from "../types";

const ASSET_TYPES = Object.values(NETWORK_DETAILS).flatMap((network) => {
  const supportedAssets = SUPPORTED_ASSET_TYPES_BY_NETWORK[network.id];
  return supportedAssets.map((assetTypeId) => ({
    networkId: network.id,
    assetTypeId,
  }));
});

const NetworkList: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, refetch } = useFetchPhononsQuery({ sessionId });

  // todo - display each token separately
  // currently we group tokens by their network and assetType.
  const asstTypesWithValue: Omit<NetworkListItemProps, "isLoading">[] =
    useMemo(() => {
      return ASSET_TYPES.map((at) => {
        const value = data
          ?.filter(
            (phonon) =>
              phonon.CurrencyType === at.networkId &&
              phonon.ChainID === at.assetTypeId
          )
          .reduce((sum, next) => {
            return sum.add(
              at.assetTypeId === AssetTypeId.Native ? next.Denomination : "1"
            );
          }, ethers.constants.Zero);

        return {
          ...at,
          value,
        };
      });
    }, [data]);

  function refresh(event: CustomEvent<any>) {
    refetch();
    event.detail.complete();
  }

  return (
    <IonContent>
      <div className="mt-2 text-center">
        <p className="text-xs font-extrabold text-zinc-500">WALLET</p>
        <p className="mb-3">{useSessionDisplayName(sessionId)}</p>
      </div>

      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={refresh}
          closeDuration={"50ms"}
        >
          <IonRefresherContent />
        </IonRefresher>
        <IonList>
          {asstTypesWithValue.map((x) => (
            <NetworkListItem key={`${x.networkId} ${x.assetTypeId}`} {...x} />
          ))}
        </IonList>
      </IonContent>
    </IonContent>
  );
};

export default NetworkList;
