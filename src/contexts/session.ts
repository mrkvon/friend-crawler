import { ISessionInfo } from '@inrupt/solid-client-authn-browser'
import { createContext } from 'react'

export type SessionInfo = Required<ISessionInfo>
export const SessionContext = createContext<SessionInfo | null>(null)
