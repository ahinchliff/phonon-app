import {
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NetworkListItem, {
  Props as NetworkListItemProps,
} from "../components/NetworkListItem";
import {
  NetworkDetails,
  NETWORKS,
  SUPPORTED_ASSET_TYPES_BY_NETWORK,
} from "../constants/networks";
import { useFetchPhononsQuery } from "../store/api";
import { AssetTypeId, NetworkId, NetworkValue } from "../types";
import { reduceDenominations } from "../utils/math";

const NetworkList: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, refetch, isLoading } = useFetchPhononsQuery({ sessionId });
  const [networkValues, setNetworkValues] = useState<NetworkValue[] | null>(
    null
  );

  const networkWithAssetType: Omit<NetworkListItemProps, "isLoading">[] =
    Object.values(NETWORKS).flatMap((network) => {
      const supportedAssets = SUPPORTED_ASSET_TYPES_BY_NETWORK[network.id];
      return supportedAssets.map((assetId) => ({
        networkId: network.id,
        assetId,
        value: ethers.constants.Zero, // todo
      }));
    });

  // useEffect(() => {
  //   const totalValueByNetwork: NetworkValue[] = Object.values(NETWORKS).map(
  //     (network, i) => {
  //       return {
  //         value: parseInt(
  //           data
  //             ?.filter((p) => p.AssetType === i)
  //             .map((p) => p.Denomination)
  //             .reduce(reduceDenominations, "0") ?? ""
  //         ),
  //         networkId: i,
  //       };
  //     }
  //   );

  //   setNetworkValues(totalValueByNetwork);
  // }, [data]);

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
          {networkWithAssetType.map((x) => (
            <NetworkListItem
              key={`${x.networkId} ${x.assetId}`}
              isLoading={isLoading}
              {...x}
            />
          ))}
        </IonList>
      </IonContent>
    </IonContent>
  );
};

export default NetworkList;
