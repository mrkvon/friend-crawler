import React, { FormEventHandler, useState, ReactNode } from 'react'
import { useSessionInfo } from '../hooks/sessionInfo'
import { getSession } from '../session'

const session = getSession()

interface Props {
  children?: ReactNode
}

export const SessionGate: React.FC<Props> = (props: Props) => {
  const [idp, setIdp] = useState('https://solidcommunity.net')
  const [loading, setLoading] = useState(false)
  const sessionInfo = useSessionInfo()

  if (loading) return <>...</>

  if (sessionInfo) return <>{props.children}</>

  const onSubmit: FormEventHandler = e => {
    e.preventDefault()
    setLoading(true)
    session.login({ oidcIssuer: idp })
  }

  const onChangeInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    const newValue = e.currentTarget.value
    setIdp(newValue)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          id="idp"
          className="input"
          type="url"
          value={idp}
          onChange={onChangeInput}
        />
        <input type="submit" value="Connect" className="button" />
      </form>
    </>
  )
}
