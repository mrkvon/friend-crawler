/*
 * based on the following example
 * https://github.com/rexxars/react-markdown/issues/10#issuecomment-347763068
 */

import React from 'react'
import 'katex/dist/katex.min.css'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import styled from 'styled-components'
import rehypeKatex from 'rehype-katex'

const Styler = styled.div`
  img {
    max-width: 100%;
  }
`

export default function Math({ children }: { children: string }) {
  const props = {
    children,
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  }
  return (
    <Styler>
      <ReactMarkdown {...props} />
    </Styler>
  )
}
