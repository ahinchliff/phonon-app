import {
  RedeemPhononDTO,
  CreatePhononResponse,
  DepositConfirmation,
  DepositRequest,
  DescriptorDTO,
  PhononDTO,
  Session,
} from "./../types/index";
import { isPlatform } from "@ionic/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = isPlatform("capacitor")
  ? "https://phonon.npmaile.com:8080/"
  : "/";
const bridgeUrl = "https://phonon.npmaile.com:443/phonon/";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Session", "Phonon"],
  endpoints: (builder) => ({
    fetchSessions: builder.query<{ Sessions: Session[] }, void>({
      query: () => "listSessions",
    }),
    unlockSession: builder.mutation<void, { sessionId: string; pin: string }>({
      query: ({ sessionId, pin }) => ({
        url: `cards/${sessionId}/unlock`,
        method: "POST",
        body: { pin },
      }),
      invalidatesTags: ["Session"],
    }),
    pairSession: builder.mutation<void, { sessionId: string; cardId: string }>({
      query: ({ cardId, sessionId }) => ({
        url: `cards/${sessionId}/Pair`,
        method: "POST",
        body: { url: `${bridgeUrl}${cardId}` },
      }),
    }),
    fetchPhonons: builder.query<PhononDTO[], { sessionId: string }>({
      query: ({ sessionId }) => `/cards/${sessionId}/listPhonons`,
      providesTags: ["Phonon"],
    }),
    createPhonon: builder.mutation<CreatePhononResponse, { sessionId: string }>(
      {
        query: ({ sessionId }) => ({
          url: `cards/${sessionId}/phonon/create`,
          method: "POST",
        }),
      }
    ),
    setDescriptor: builder.mutation<void, DescriptorDTO>({
      query: ({ index, assetType: currencyType, sessionId, value }) => ({
        url: `cards/${sessionId}/phonon/${index}/setDescriptor`,
        method: "POST",
        body: { currencyType, value },
      }),
      invalidatesTags: ["Phonon"],
    }),
    redeemPhonon: builder.mutation<
      { privateKey: string },
      { payload: RedeemPhononDTO[]; sessionId: string }
    >({
      query: ({ payload, sessionId }) => ({
        url: `cards/${sessionId}/phonon/redeem`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Phonon"],
    }),
    sendPhonon: builder.mutation<void, { index: number; sessionId: string }>({
      query: ({ index, sessionId }) => ({
        url: `cards/${sessionId}/phonon/${index}/send`,
        method: "POST",
      }),
      invalidatesTags: ["Phonon"],
    }),
    initDeposit: builder.mutation<
      PhononDTO[],
      { payload: DepositRequest; sessionId: string }
    >({
      query: ({ payload, sessionId }) => ({
        url: `cards/${sessionId}/phonon/initDeposit`,
        method: "POST",
        body: payload,
      }),
    }),
    finalizeDeposit: builder.mutation<
      DepositConfirmation,
      { payload: DepositConfirmation; sessionId: string }
    >({
      query: ({ payload, sessionId }) => ({
        url: `cards/${sessionId}/phonon/finalizeDeposit`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Phonon"],
    }),
  }),
});

export const {
  useFetchSessionsQuery,
  useUnlockSessionMutation,
  usePairSessionMutation,
  useFetchPhononsQuery,
  useCreatePhononMutation,
  useInitDepositMutation,
  useFinalizeDepositMutation,
  useSetDescriptorMutation,
  useRedeemPhononMutation,
  useSendPhononMutation,
} = api;
