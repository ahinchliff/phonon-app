import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonModal,
  IonText,
  useIonRouter,
} from "@ionic/react";
import React, { useState } from "react";
import useSessionDisplayName from "../hooks/useSessionDisplayName";
import { useUnlockSessionMutation } from "../store/api";

interface UnlockSessionModalProps {
  sessionId: string;
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
}

const UnlockSessionModal: React.FC<UnlockSessionModalProps> = ({
  sessionId,
  isOpen,
  setIsOpen,
}) => {
  const [pin, setPin] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockSession] = useUnlockSessionMutation();
  const router = useIonRouter();

  const handleCancel = () => {
    setIsOpen(false);
    setIsUnlocked(false);
  };

  const handleOnKeyDown = (event: any): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      handleLogin();
    }
  };

  const handleLogin = () => {
    unlockSession({ sessionId, pin })
      .unwrap()
      .then(() => {
        setIsOpen(false);
        setIsUnlocked(true);
      })
      // TODO: Handle error and display something to the user
      .catch((err) => {
        console.error(err);
        setIsUnlocked(false);
      });
  };

  const displayName = useSessionDisplayName(sessionId);

  return (
    <IonContent>
      <IonModal
        isOpen={isOpen}
        onDidDismiss={() => {
          if (isUnlocked) router.push(`/${sessionId}/`);
        }}
      >
        <div className="flex flex-col content-center justify-center h-full p-10">
          <IonText color="light">
            <h1 className="mx-auto text-lg text-center">
              Unlock {displayName}
            </h1>
          </IonText>
          <IonItem className="my-7">
            <IonInput
              value={pin}
              placeholder="Password"
              type="password"
              onIonChange={(e) => setPin(e?.detail?.value ?? "")}
              onKeyDown={handleOnKeyDown}
            ></IonInput>
          </IonItem>
          <div className="flex flex-row justify-evenly">
            <IonButton color="medium" fill="clear" onClick={handleCancel}>
              Cancel
            </IonButton>
            <IonButton onClick={handleLogin}>Unlock</IonButton>
          </div>
        </div>
      </IonModal>
    </IonContent>
  );
};

export default UnlockSessionModal;
