import React, {
  Component,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import shallowCompare from 'react-addons-shallow-compare'
import HTMLStyles from './HTMLStyles'

class HTMLElement extends Component {
  /* ****************************************************************************/
  // Class
  /* ****************************************************************************/

  propTypes: {
    tagName: React.PropTypes.string.isRequired,
    groupInfo: React.PropTypes.object,
    parentTagName: React.PropTypes.string,
    htmlStyles: View.PropTypes.style,
    inlineStyle: React.PropTypes.string,
    onLinkPress: React.PropTypes.func,
    onLinkPressArg: React.PropTypes.any
  }

  /* ****************************************************************************/
  // Data Lifecycle
  /* ****************************************************************************/

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  /* ****************************************************************************/
  // UI Events
  /* ****************************************************************************/

  handleLinkPressed (evt) {
    if (this.props.onLinkPress) {
      this.props.onLinkPress(evt, this.props.onLinkPressArg)
    }
  }

  /* ****************************************************************************/
  // Rendering
  /* ****************************************************************************/

  /**
  * Generates the prefix nodes
  * @return prefix nodes if applicable
  */
  prefixNode () {
    if (this.props.tagName === 'li') {
      if (this.props.parentTagName === 'ol') {
        return <Text>{`\n${this.props.groupInfo.index + 1}). `}</Text>
      } else {
        return <Text>{"\n• "}</Text>
      }
    } else {
      return undefined
    }
  }

  render () {
    const { htmlStyles, tagName, inlineStyle, ...passProps } = this.props

    const style = []
      .concat(
        HTMLStyles.defaultStyles[tagName],
        htmlStyles ? htmlStyles[tagName] : undefined,
        inlineStyle ? HTMLStyles.cssStringToRNStyle(inlineStyle) : undefined
      )
      .filter(s => s !== undefined)

    if (tagName === 'a') {
      return (
        <TouchableOpacity onPress={this.handleLinkPressed}>
          <Text {...passProps} style={style}>
            {this.prefixNode()}
            {this.props.children}
          </Text>
        </TouchableOpacity>
      )
    } else {
      const RNNode = tagName === 'div' ? View : Text
      return (
        <RNNode {...passProps} style={style}>
          {this.prefixNode()}
          {this.props.children}
        </RNNode>
      )
    }
  }
}

module.exports = HTMLElement