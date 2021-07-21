import React from 'react'
import styled from 'styled-components'

const Link = styled.a`
  color: lightgray;
  &:hover {
    color: white;
  }
`
const Footer = styled.footer`
  color: gray;
`

const About: React.FC = props => (
  <div {...props}>
    <Footer>
      powered by <Link href="https://solidproject.org">Solid</Link> &middot;{' '}
      <Link href="https://github.com/mrkvon/friend-crawler">source</Link>
    </Footer>
  </div>
)

export default About
