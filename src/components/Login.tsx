import React, { useState, useEffect, useContext } from 'react'
import {
  login,
  logout,
  handleIncomingRedirect,
} from '@inrupt/solid-client-authn-browser'
import { SessionContext, SessionInfo } from '../contexts/session'

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
    handleIncomingRedirect(window.location.href)
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
  const handleLogin = async () => {
    setLoading(true)
    await login({
      oidcIssuer: 'https://solidcommunity.net',
      redirectUrl: window.location.href,
      clientName: 'Math Livegraph',
    })
    setLoading(false)
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
    <span {...commonProps}>Loading</span>
  ) : info?.isLoggedIn ? (
    <button {...commonProps} onClick={handleLogout}>
      {info?.webId} Logout
    </button>
  ) : (
    <button {...commonProps} onClick={handleLogin}>
      Login
    </button>
  )
}

export default Login
