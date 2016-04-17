import React, {
  Component,
  Text,
  View
} from 'react-native'
import shallowCompare from 'react-addons-shallow-compare'
import htmlparser2 from 'htmlparser2'
import HTMLElement from './HTMLElement'
import HTMLTextNode from './HTMLTextNode'

class HTML extends Component {
  /* ****************************************************************************/
  // Class
  /* ****************************************************************************/

  propTypes: {
    html: React.PropTypes.string.isRequired,
    htmlStyles: View.propTypes.style,
    onLinkPress: React.PropTypes.func
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
  * @return the equivalent RN elements
  */
  renderHtmlAsRN (htmlElements, parentTagName) {
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
          let groupInfo = undefined
          if (node.name === 'li') {
            groupInfo = {
              index: htmlElements.reduce((acc, e) => {
                if (e === node) {
                  acc.found = true
                } else if (!acc.found && e.type === 'tag' && e.name === 'li') {
                  acc.index++
                }
                return acc
              }, {index: 0, found:false}).index,
              count: htmlElements.filter(e => e.type === 'tag' && e.name === 'li').length
            }
          }

          return (
            <HTMLElement
              key={index}
              htmlStyles={this.props.htmlStyles}
              inlineStyle={node.attribs.style}
              tagName={node.name}
              groupInfo={groupInfo}
              parentTagName={parentTagName}
              onLinkPress={this.props.onLinkPress}
              onLinkPressArg={node.name === 'a' ? node.attribs.href : undefined}>
              {this.renderHtmlAsRN(node.children, node.name)}
            </HTMLElement>)
        }
      })
      .filter(e => e !== undefined)
  }

  render () {
    let rnNodes
    const parser = new htmlparser2.Parser(
      new htmlparser2.DomHandler((err, dom) => {
        rnNodes = this.renderHtmlAsRN(dom)
      })
    )
    parser.write(this.props.html)
    parser.done()

    return (<View>{rnNodes}</View>)
  }
}

module.exports = HTML