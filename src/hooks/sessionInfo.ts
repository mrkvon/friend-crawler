import { useContext } from 'react'
import { SessionContext } from '../contexts/session'

export function useSessionInfo() {
  const sessionInfo = useContext(SessionContext)

  return sessionInfo
}
