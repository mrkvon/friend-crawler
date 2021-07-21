import React from 'react'
import Login from './Login'
import VisualizationContainer from './VisualizationContainer'
import styled from 'styled-components'
import { PeopleListContainer } from './PeopleList'
import About from './About'

const PositionedLogin = styled(Login)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: block;
`
const PositionedAbout = styled(About)`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: block;
`

const PositionedPeopleList = styled(PeopleListContainer)`
  position: fixed;
  top: 1rem;
  left: 1rem;
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

      <PositionedAbout />

      <FullSizeVisualization />
    </>
  )
}

export default Layout
