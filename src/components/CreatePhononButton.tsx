import React from "react";
import { IonButton, IonIcon, useIonRouter } from "@ionic/react";
import { addSharp } from "ionicons/icons";
import { getCreatePath } from "../utils/navigation";
import useSessionIdFromParams from "../hooks/useSessionIdFromParams";

export const CreatePhononButton = () => {
  const router = useIonRouter();

  const sessionId = useSessionIdFromParams();

  const goToCreatePage = () => {
    router.push(getCreatePath(sessionId));
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
};

export default CreatePhononButton;
