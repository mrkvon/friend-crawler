import React, { useState } from 'react'
import Modal from 'react-modal'
import { useSessionInfo } from '../hooks/sessionInfo'
import { SessionGate } from './SessionGate'

interface Props {
  children: React.ReactNode
}

export const SessionPrompt: React.FC<Props> = (props: Props) => {
  const sessionInfo = useSessionInfo()
  const [promptOpen, setPromptOpen] = useState(false)

  if (sessionInfo) {
    return <>{props.children}</>
  }

  if (!promptOpen) {
    return (
      <>
        <button
          className="button"
          onClick={e => {
            e.preventDefault()
            setPromptOpen(true)
          }}
        >
          Login
        </button>
      </>
    )
  }

  return (
    <>
      <Modal
        isOpen={promptOpen}
        onRequestClose={() => setPromptOpen(false)}
        contentLabel="Connect your Solid Pod"
        overlayClassName={{
          base: 'modal modal-background is-active',
          afterOpen: '',
          beforeClose: '',
        }}
        className={{
          base: 'modal-content box',
          afterOpen: '',
          beforeClose: '',
        }}
        closeTimeoutMS={50}
      >
        <button className="modal-close" onClick={() => setPromptOpen(false)}>
          close
        </button>
        <SessionGate />
      </Modal>
    </>
  )
}
