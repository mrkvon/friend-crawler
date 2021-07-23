import React, { useState, useEffect, useContext } from 'react'
import {
  login,
  logout,
  handleIncomingRedirect,
} from '@inrupt/solid-client-authn-browser'
import { SessionContext, SessionInfo } from '../contexts/session'
import LoginPrompt from './LoginPrompt'

interface Props {
  className?: string
}

const Login: React.FC<Props> = (
  { className, ...props }: Props = { className: '' },
) => {
  const [loading, setLoading] = useState(true)
  const [info, setInfo] = useContext(SessionContext)
  useEffect(() => {
    setLoading(true)
    handleIncomingRedirect({
      url: window.location.href,
      restorePreviousSession: true,
    })
      .then(newInfo => {
        if (newInfo) setInfo(newInfo as SessionInfo)
      })
      .catch(e => {
        console.log(e)
        setInfo(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setInfo])

  const handleLogin = async (oidcIssuer: string) => {
    setLoading(true)
    try {
      await login({
        oidcIssuer,
        redirectUrl: window.location.href,
        clientName: 'Friends Crawler',
      })
    } catch (error) {
      alert(`Could not find a Solid Pod at ${oidcIssuer}`)
      localStorage.removeItem('idp')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    if (setInfo) setInfo(null)
    setLoading(false)
  }

  const commonProps = {
    ...props,
    className: `${className} button`,
  }

  return loading ? (
    <button {...commonProps} disabled>
      Loading
    </button>
  ) : info?.isLoggedIn ? (
    <button {...commonProps} onClick={handleLogout}>
      {info?.webId} Logout
    </button>
  ) : (
    <LoginPrompt {...commonProps} onLogin={handleLogin} />
  )
}

export default Login
