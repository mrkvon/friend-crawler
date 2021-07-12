import { ISessionInfo } from '@inrupt/solid-client-authn-browser'
import React, { createContext } from 'react'

export type SessionInfo = Required<ISessionInfo>
export const SessionContext = createContext<
  [SessionInfo | null, React.Dispatch<React.SetStateAction<SessionInfo | null>>]
>([
  null,
  () => {
    return
  },
])
