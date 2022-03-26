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
import useNetwork from "../hooks/useNetwork";
import useSessionId from "../hooks/useSession";
import { useFetchPhononsQuery } from "../store/api";
import { weiToEth } from "../utils/denomination";
import { reduceDenominations, sortPhonon } from "../utils/math";

const PhononsList: React.FC = () => {
  const sessionId = useSessionId();
  const network = useNetwork();

  // todo - filter by asset type here (currently ChainId)
  const { data, refetch, isLoading, isFetching } = useFetchPhononsQuery({
    sessionId,
  });

  function refresh(event: CustomEvent<any>) {
    refetch();
    event.detail.complete();
  }

  const total =
    data
      ?.filter((p) => p.CurrencyType === network.id)
      .map((p) => p.Denomination)
      .reduce(reduceDenominations, "0") ?? "0";

  return (
    <IonContent>
      <div className="mt-2 text-center">
        <p className="text-md font-extrabold text-zinc-500">WALLET</p>
        <p className="text-xl mb-5">
          {weiToEth(total)} {network?.symbol}
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
              ?.filter((item) => item.CurrencyType === network.id)
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
