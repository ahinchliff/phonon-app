import { IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { logOutOutline } from "ionicons/icons";
import React from "react";
import { useParams } from "react-router";
import { getRedeemPath } from "../utils/navigation";

export default function RedeemPhononButton() {
  const { sessionId, networkId, assetId } = useParams<{
    sessionId: string;
    networkId: string;
    assetId: string;
  }>();
  const router = useIonRouter();

  const goToRedeemPage = () => {
    router.push(getRedeemPath(sessionId, networkId, assetId));
  };

  return (
    <>
      <IonButton
        fill="outline"
        color="tertiary"
        slot="secondary"
        onClick={goToRedeemPage}
        className="shadow-lg shadow-blue-300/20"
      >
        <IonIcon slot="end" icon={logOutOutline} />
        Redeem
      </IonButton>
    </>
  );
}
