import React from 'react'
import { SessionPrompt } from './components/SessionPrompt'
import { useSessionInfo } from './hooks/sessionInfo'
import { getStringNoLocale } from '@inrupt/solid-client'
import { foaf } from 'rdf-namespaces'
import { useProfile } from './hooks/profile'

function App() {
  const info = useSessionInfo()
  const profile = useProfile()

  const name = profile
    ? getStringNoLocale(profile.data, foaf.name)
    : info?.webId

  return (
    <>
      <SessionPrompt>Welcome {name}</SessionPrompt>

      <pre>{'There will be a content.'}</pre>
    </>
  )
}

export default App
