import React from 'react'
import Login from './Login'
import Visualization from './Visualization'
import styled from 'styled-components'

const UserPositioning = styled.div`
  position: fixed;
  top: 1em;
  right: 1em;
`

const FullSizeVisualization = styled(Visualization)`
  height: 100vh;
  width: 100vw;
  display: block;
`

const Layout: React.FC = () => {
  return (
    <>
      <UserPositioning>
        <Login />
      </UserPositioning>

      <FullSizeVisualization />
    </>
  )
}

export default Layout
