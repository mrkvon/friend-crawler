import React from 'react'
import Login from './Login'
import VisualizationContainer from './VisualizationContainer'
import styled from 'styled-components'
import { PeopleListContainer } from './PeopleList'

const PositionedLogin = styled(Login)`
  position: fixed;
  top: 1em;
  right: 1em;
  display: block;
`

const PositionedPeopleList = styled(PeopleListContainer)`
  position: fixed;
  top: 1em;
  left: 1em;
  display: block;
  background-color: white;
  padding: 0.25rem;
`

const FullSizeVisualization = styled(VisualizationContainer)`
  height: 100vh;
  width: 100vw;
  display: block;
`

const Layout: React.FC = () => {
  return (
    <>
      <PositionedPeopleList />

      <PositionedLogin />

      <FullSizeVisualization />
    </>
  )
}

export default Layout
