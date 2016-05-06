import React from 'react'
import { View } from 'react-native'
import shallowCompare from 'react-addons-shallow-compare'
import htmlparser2 from 'htmlparser2'
import HTMLElement from './HTMLElement'
import HTMLTextNode from './HTMLTextNode'
import HTMLRenderers from './HTMLRenderers'
import HTMLStyles from './HTMLStyles'

class HTML extends React.Component {
  /* ****************************************************************************/
  // Class
  /* ****************************************************************************/

  static propTypes = {
    html: React.PropTypes.string.isRequired,
    htmlStyles: React.PropTypes.object,
    onLinkPress: React.PropTypes.func,
    renderers: React.PropTypes.object.isRequired
  }

  static defaultProps = {
    renderers: HTMLRenderers
  }

  /* ****************************************************************************/
  // Data Lifecycle
  /* ****************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /* ****************************************************************************/
  // Rendering
  /* ****************************************************************************/

  /**
  * Converts the html elements to RN elements
  * @param htmlElements: the array of html elements
  * @param parentTagName='body': the parent html element if any
  * @param parentIsText: true if the parent element was a text-y element
  * @return the equivalent RN elements
  */
  renderHtmlAsRN (htmlElements, parentTagName, parentIsText) {
    return htmlElements
      .map((node, index, list) => {
        if (node.type === 'text') {
          const str = HTMLTextNode.removeWhitespaceListHTML(node.data, index, parentTagName)
          if (str.length) {
            return (<HTMLTextNode key={index}>{str}</HTMLTextNode>)
          } else {
            return undefined
          }
        } else if (node.type === 'tag') {
          // Generate grouping info if we are a group-type element
          let groupInfo
          if (node.name === 'li') {
            groupInfo = {
              index: htmlElements.reduce((acc, e) => {
                if (e === node) {
                  acc.found = true
                } else if (!acc.found && e.type === 'tag' && e.name === 'li') {
                  acc.index++
                }
                return acc
              }, {index: 0, found: false}).index,
              count: htmlElements.filter((e) => e.type === 'tag' && e.name === 'li').length
            }
          }

          return (
            <HTMLElement
              key={index}
              htmlStyles={this.props.htmlStyles}
              htmlAttribs={node.attribs}
              tagName={node.name}
              groupInfo={groupInfo}
              parentTagName={parentTagName}
              parentIsText={parentIsText}
              onLinkPress={this.props.onLinkPress}
              renderers={this.props.renderers}>
              {this.renderHtmlAsRN(node.children, node.name, !HTMLStyles.blockElements.has(node.name))}
            </HTMLElement>)
        }
      })
      .filter((e) => e !== undefined)
  }

  render () {
    let rnNodes
    const parser = new htmlparser2.Parser(
      new htmlparser2.DomHandler((_err, dom) => {
        rnNodes = this.renderHtmlAsRN(dom, 'body', false)
      })
    )
    parser.write(this.props.html)
    parser.done()

    return (<View>{rnNodes}</View>)
  }
}

module.exports = HTML
