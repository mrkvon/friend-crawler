import React from 'react'
import Login from './Login'
import VisualizationContainer from './VisualizationContainer'
import styled from 'styled-components'

const PositionedLogin = styled(Login)`
  position: fixed;
  top: 1em;
  right: 1em;
  display: block;
`

const FullSizeVisualization = styled(VisualizationContainer)`
  height: 100vh;
  width: 100vw;
  display: block;
`

const Layout: React.FC = () => {
  return (
    <>
      <PositionedLogin />

      <FullSizeVisualization />
    </>
  )
}

export default Layout
