import React, { useState, useEffect, ReactNode } from 'react'
import { SessionContext, SessionInfo } from '../contexts/session'
import { getSession } from '../session'

const session = getSession()

interface Props {
  children: ReactNode
}

const SessionProvider: React.FC<Props> = (props: Props) => {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null)

  useEffect(() => {
    ;(async () => {
      const info = await session.handleIncomingRedirect(window.location.href)
      if (info && info.isLoggedIn) {
        setSessionInfo(info as SessionInfo)
      }
    })()
  }, [])

  return (
    <SessionContext.Provider value={sessionInfo}>
      {props.children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
