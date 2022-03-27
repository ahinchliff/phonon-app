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
  NETWORKS,
  SUPPORTED_ASSET_TYPES_BY_NETWORK,
} from "../constants/networks";
import { useFetchPhononsQuery } from "../store/api";

const ASSET_TYPES = Object.values(NETWORKS).flatMap((network) => {
  const supportedAssets = SUPPORTED_ASSET_TYPES_BY_NETWORK[network.id];
  return supportedAssets.map((assetId) => ({
    networkId: network.id,
    assetId,
  }));
});

const NetworkList: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, refetch } = useFetchPhononsQuery({ sessionId });

  // todo - display each token separately
  // currency we group tokens by their network.
  const asstTypesWithValue: Omit<NetworkListItemProps, "isLoading">[] =
    useMemo(() => {
      return ASSET_TYPES.map((at) => {
        const value = data
          ?.filter(
            (phonon) =>
              phonon.CurrencyType === at.networkId &&
              phonon.ChainID === at.assetId
          )
          .reduce(
            (sum, next) => sum.add(next.Denomination),
            ethers.constants.Zero
          );

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
        <p className="mb-3">{sessionId}</p>
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
            <NetworkListItem key={`${x.networkId} ${x.assetId}`} {...x} />
          ))}
        </IonList>
      </IonContent>
    </IonContent>
  );
};

export default NetworkList;
