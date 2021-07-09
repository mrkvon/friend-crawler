import React from 'react'
import { SessionPrompt } from './SessionPrompt'
import { useSessionInfo } from '../hooks/sessionInfo'
import { getStringNoLocale } from '@inrupt/solid-client'
import { foaf } from 'rdf-namespaces'
import { useProfile } from '../hooks/profile'

const Login: React.FC = () => {
  const info = useSessionInfo()
  const profile = useProfile()

  const name = profile
    ? getStringNoLocale(profile.data, foaf.name)
    : info?.webId

  return (
    <SessionPrompt>
      <a href={info?.webId} className="button">
        {name}
      </a>
    </SessionPrompt>
  )
}

export default Login
