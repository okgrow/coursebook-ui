import React from 'react'
import ReactDom from 'react-dom'
import marked from 'marked'
import dynamic from 'next/dynamic'

const Highlight = dynamic(import('react-highlight'), {
  // Here we don't show any loading component.
  // But instead, we'll show the markdown content without syntax-highlight
  loading: ({ children }) => (
    <div
      dangerouslySetInnerHTML={{__html: children}}
    />
  )
})

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true
})

export default class Markdown extends React.Component {
  makeLinksOpenInANewTab() {
    const dom = ReactDom.findDOMNode(this)
    const links = dom.getElementsByTagName('a')
    Object.keys(links).forEach((id) => {
      const link = links[id]
      if (link.setAttribute) {
        link.setAttribute('target', '_blank')
      }
    })
  }

  componentDidMount () {
    this.makeLinksOpenInANewTab()
  }

  componentDidUpdate () {
    this.makeLinksOpenInANewTab()
  }

  renderMarkdown () {
    const { content } = this.props

    // Only use the syntax-highlight component only if there's a code block
    // That's because it's too heavy.
    if (/~~~/.test(content)) {
      return (
        <Highlight innerHTML={true}>
          {marked(content)}
        </Highlight>
      )
    }

    return (
      <div
        dangerouslySetInnerHTML={{__html: marked(content)}}
      />
    )
  }

  render () {
    return (
      <div className='markdown'>
        { this.renderMarkdown() }
        <style jsx global>{`
          .markdown{
            font-family: "Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            max-width: 600px;
            color: #444;
            line-height: 25px;
          }

          .markdown h2 {
            font-size: 20px;
          }

          .markdown h3 {
            font-size: 18px;
          }

          .markdown blockquote {
            padding: 10px 20px;
            margin: 18px 0;
            border-left: 5px solid #B2CDA9;
          }

          .markdown blockquote p {
            margin: 0;
          }

          .markdown pre {
            font-size: 14px;
            line-height: 20px;
            background-color: #f9f9f9;
            padding: 10px 15px;
            border: 1px solid #eee;
            margin: 25px 0;
          }

          .markdown code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 13px;
            background-color: #f9f9f9;
            border-radius: 3px;
            padding: 2px 5px;
          }

          .markdown pre code {
            padding: 0;
            border-radius: 0;
          }

          .markdown img {
            max-width: 100%
          }

          .markdown a {
            text-decoration: none;
            color: #2196F3;
            border-bottom: 1px solid #2196F3;
          }

          .markdown a:hover {
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }
}
