import React from 'react'
import { Text } from 'react-native'
import shallowCompare from 'react-addons-shallow-compare'
import { AllHtmlEntities } from 'html-entities'

const RE = Object.freeze({
  MULT_WHITESPACE: new RegExp(/\s+/g),
  MULT_NEWLINE: new RegExp(/\n+/g),

  PREFIX_NEWLINE: new RegExp(/^\n/g),
  PREFIX_WHITESPACE: new RegExp(/^\s/g),

  SUFFIX_NEWLINE: new RegExp(/\n$/g)
})
const TEXT_TAG_NAMES = [
  'p', 'span', 'li', 'a',
  'em', 'i', 'u', 'b', 'strong', 'big', 'small',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
].reduce((acc, n) => { acc.add(n); return acc }, new Set())
const PRE_TAG_NAMES = [
  'pre', 'code'
].reduce((acc, n) => { acc.add(n); return acc }, new Set())

class HTMLTextNode extends React.Component {
  /* ****************************************************************************/
  // Class
  /* ****************************************************************************/

  static propTypes = {
    children: React.PropTypes.string.isRequired
  }

  /**
  * Formats text the same way a browser would be removing whitespace
  * @param str: the string to remove chars from
  * @param nodeIndex: the index of the node in its parent
  * @param parentTagName: the name of the parent node
  * @return the new string
  */
  static removeWhitespaceListHTML (str, nodeIndex, parentTagName) {
    if (PRE_TAG_NAMES.has(parentTagName)) {
      return str
    } else {
      const htmlStr = str
        .replace(RE.MULT_NEWLINE, '\n')
        .replace(RE.MULT_WHITESPACE, ' ')
        .replace(RE.PREFIX_NEWLINE, '')
        .replace(RE.SUFFIX_NEWLINE, '')

      if (!TEXT_TAG_NAMES.has(parentTagName) && htmlStr.trim().length === 0) {
        return ''
      } else {
        if (nodeIndex === 0) {
          return htmlStr.replace(RE.PREFIX_WHITESPACE, '')
        } else {
          return htmlStr
        }
      }
    }
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

  render () {
    return (<Text {...this.props}>{AllHtmlEntities.decode(this.props.children)}</Text>)
  }
}

module.exports = HTMLTextNode
