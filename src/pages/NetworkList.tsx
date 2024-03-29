import {
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NetworkListItem from "../components/NetworkListItem";
import { NETWORKS } from "../constants/networks";
import useSessionDisplayName from "../hooks/useSessionDisplayName";
import { useFetchPhononsQuery } from "../store/api";
import { NetworkValue } from "../types";
import { reduceDenominations } from "../utils/math";

const NetworkList: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, refetch, isLoading } = useFetchPhononsQuery({ sessionId });
  const [networkValues, setNetworkValues] = useState<NetworkValue[] | null>(
    null
  );

  useEffect(() => {
    // const networks: number[] = uniqBy(data, "type")
    //   .map((p: Phonon) => p.type)
    //   .sort() as number[];

    const totalValueByNetwork: NetworkValue[] = NETWORKS.map((network, i) => {
      return {
        value: parseInt(
          data
            ?.filter((p) => p.CurrencyType === i)
            .map((p) => p.Denomination)
            .reduce(reduceDenominations, "0") ?? ""
        ),
        networkId: i,
      };
    });

    setNetworkValues(totalValueByNetwork);
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
          {networkValues?.map(({ networkId, value }) => (
            <NetworkListItem
              key={networkId}
              {...{ isLoading, networkId, value }}
            />
          ))}
        </IonList>
      </IonContent>
    </IonContent>
  );
};

export default NetworkList;
