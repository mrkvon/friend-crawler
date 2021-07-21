import React from 'react'
import Layout from './components/Layout'
import DataContainer from './components/DataContainer'
import { BrowserRouter as Router } from 'react-router-dom'

const App: React.FC = () => (
  <Router>
    <DataContainer>
      <Layout />
    </DataContainer>
  </Router>
)

export default App
