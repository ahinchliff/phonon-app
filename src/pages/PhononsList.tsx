import {
  IonButtons,
  IonContent,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";
import React from "react";
import CreatePhononButton from "../components/CreatePhononButton";
import PhononListItem from "../components/PhononListItem";
import RedeemPhononButton from "../components/RedeemPhononButton";
import SendPhononButton from "../components/SendPhononButton";
import useAssetTypeFromParams from "../hooks/useAssetTypeFromParams";
import useNetworkFromParams from "../hooks/useNetworkFromParams";
import useSessionIdFromParams from "../hooks/useSessionIdFromParams";
import { useFetchPhononsQuery } from "../store/api";
import { sortPhonon } from "../utils/math";

const PhononsList: React.FC = () => {
  const sessionId = useSessionIdFromParams();
  const network = useNetworkFromParams();
  const assetType = useAssetTypeFromParams();

  const { data, refetch, isLoading, isFetching } = useFetchPhononsQuery({
    sessionId,
  });

  function refresh(event: CustomEvent<any>) {
    refetch();
    event.detail.complete();
  }

  // todo - add totals back in.
  // const total = data
  //   ?.filter((p) => p.CurrencyType === network.id && p.ChainID === assetType.id)
  //   .reduce((sum, next) => sum.add(next.Denomination), ethers.constants.Zero);

  return (
    <IonContent>
      <div className="mt-2 text-center">
        <p className="text-md font-extrabold text-zinc-500">WALLET</p>
        <p className="text-xl mb-5">
          {/* {ethers.utils.formatUnits(total, '18')} {network?.symbol} */}
        </p>
      </div>

      <div className="flex mb-5 justify-evenly">
        <IonButtons slot="primary">
          <CreatePhononButton />
        </IonButtons>
        <IonButtons slot="secondary">
          <SendPhononButton />
        </IonButtons>
        <IonButtons slot="end">
          <RedeemPhononButton />
        </IonButtons>
      </div>

      {isLoading || isFetching ? (
        <div className="w-full flex justify-center align-middle">
          <IonSpinner />
        </div>
      ) : (
        <IonContent>
          <IonRefresher
            slot="fixed"
            onIonRefresh={refresh}
            closeDuration={"50ms"}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonList>
            {data
              ?.filter(
                (item) =>
                  item.CurrencyType === network.id &&
                  item.ChainID === assetType.id
              )
              .sort(sortPhonon)
              .map((item) => (
                <PhononListItem phonon={item} key={item.PubKey} />
              ))}
          </IonList>
        </IonContent>
      )}
    </IonContent>
  );
};

export default PhononsList;
