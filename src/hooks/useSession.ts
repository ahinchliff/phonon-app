import { useParams } from "react-router";

const useSessionId = (): string => {
  const { sessionId } = useParams<{
    sessionId: string;
  }>();

  if (!sessionId) {
    throw Error("Session id expected");
  }

  return sessionId;
};

export default useSessionId;
