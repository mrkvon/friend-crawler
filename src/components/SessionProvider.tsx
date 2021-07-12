import React, { useState, ReactNode } from 'react'
import { SessionContext, SessionInfo } from '../contexts/session'

interface Props {
  children: ReactNode
}

const SessionProvider: React.FC<Props> = (props: Props) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  return (
    <SessionContext.Provider value={[sessionInfo, setSessionInfo]}>
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
