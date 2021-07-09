import React from 'react'
import { SessionGate } from './components/SessionGate'
import { useSessionInfo } from './hooks/sessionInfo'

function App() {
  const info = useSessionInfo()

  return (
    <>
      <SessionGate>Welcome {info?.webId}</SessionGate>

      <pre>{'There will be a content.'}</pre>
    </>
  )
}

export default App
