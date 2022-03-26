import React from "react";
import { IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { addSharp } from "ionicons/icons";
import { useParams } from "react-router";
import { getCreatePath } from "../utils/navigation";

export default function CreatePhononButton() {
  const { sessionId, networkId, assetId } = useParams<{
    sessionId: string;
    networkId: string;
    assetId: string;
  }>();
  const router = useIonRouter();

  const goToCreatePage = () => {
    router.push(getCreatePath(sessionId, networkId, assetId));
  };

  return (
    <>
      <IonButton
        fill="outline"
        color="primary"
        slot="end"
        onClick={goToCreatePage}
        className="shadow-lg shadow-blue-300/20"
      >
        <IonIcon slot="end" icon={addSharp} />
        Create
      </IonButton>
    </>
  );
}
