import React from 'react'
import { SessionPrompt } from './components/SessionPrompt'
import { useSessionInfo } from './hooks/sessionInfo'

function App() {
  const info = useSessionInfo()

  return (
    <>
      <SessionPrompt>Welcome {info?.webId}</SessionPrompt>

      <pre>{'There will be a content.'}</pre>
    </>
  )
}

export default App
