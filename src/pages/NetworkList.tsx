import {
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import CreatePhononButton from "../components/CreatePhononButton";
import NetworkListItem, {
  Props as NetworkListItemProps,
} from "../components/NetworkListItem";
import { TAGS } from "../constants/tags";
import useSessionDisplayName from "../hooks/useSessionDisplayName";
import { useFetchPhononsQuery } from "../store/api";
import { AssetTypeId } from "../types";
import { getTagValue } from "../utils/phonon/phonon-general";

const NetworkList: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: phonons, refetch } = useFetchPhononsQuery({ sessionId });

  const listItemData: NetworkListItemProps[] | undefined = useMemo(() => {
    return phonons?.reduce((progress, phonon) => {
      const contractAddress = getTagValue(phonon, TAGS.contractAddress);

      const indexOfExisting = progress.findIndex((item) => {
        if (phonon.ChainID === AssetTypeId.ERC721) {
          return item.assetTypeId === AssetTypeId.ERC721;
        }

        if (phonon.ChainID === AssetTypeId.ERC20) {
          return (
            item.assetTypeId === phonon.ChainID &&
            item.networkId === phonon.CurrencyType &&
            item.contractAddress === contractAddress
          );
        }

        return (
          item.assetTypeId === phonon.ChainID &&
          item.networkId === phonon.AddressType
        );
      });

      if (indexOfExisting === -1) {
        return [
          ...progress,
          {
            networkId: phonon.CurrencyType,
            assetTypeId: phonon.ChainID,
            contractAddress,
            value:
              phonon.ChainID === AssetTypeId.ERC721 ? "1" : phonon.Denomination,
          },
        ];
      }

      const exisitingItem = progress[indexOfExisting];
      const existingValue = Number(exisitingItem.value);

      const updatedItem = {
        ...exisitingItem,
        value:
          phonon.ChainID === AssetTypeId.ERC721
            ? (existingValue + 1).toString()
            : (existingValue + Number(phonon.Denomination)).toString(),
      };

      progress.splice(indexOfExisting, 1, updatedItem);

      return progress;
    }, [] as NetworkListItemProps[]);
  }, [phonons]);

  function refresh(event: CustomEvent<any>) {
    refetch();
    event.detail.complete();
  }

  return (
    <IonContent>
      <div className="flex justify-between mt-2">
        <div>
          <p className="text-xs font-extrabold text-zinc-500">WALLET</p>
          <p className="mb-3">{useSessionDisplayName(sessionId)}</p>
        </div>
        <CreatePhononButton />
      </div>

      <IonContent>
        <IonRefresher
          slot="fixed"
          onIonRefresh={refresh}
          closeDuration={"50ms"}
        >
          <IonRefresherContent />
        </IonRefresher>
        {listItemData?.length === 0 && <p>Empty wallet</p>}

        <IonList>
          {listItemData ? (
            listItemData.map((x) => (
              <NetworkListItem key={`${x.networkId} ${x.assetTypeId}`} {...x} />
            ))
          ) : (
            <IonSpinner />
          )}
        </IonList>
      </IonContent>
    </IonContent>
  );
};

export default NetworkList;
