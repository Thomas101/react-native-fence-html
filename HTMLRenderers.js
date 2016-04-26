import React, {
  TouchableOpacity,
  Text,
  Image
} from 'react-native'

module.exports = {
  /**
  * Renders an anchor tag
  * @param htmlAttribs: dict of html attributes
  * @param style: the processed style attributes
  * @param children: the children to place within the element
  * @param passProps: other props that are to be passed into the element
  * @return a RN element that represents an anchor tag
  */
  a: (htmlAttribs, style, children, passProps) => {
    return (
      <TouchableOpacity
        onPress={(evt) => { passProps.onLinkPress ? passProps.onLinkPress(evt, htmlAttribs.href) : undefined }}>
        <Text {...passProps} style={style}>
          {children}
        </Text>
      </TouchableOpacity>
    )
  },
  /**
  * Renders an image tag
  * @param htmlAttribs: dict of html attributes
  * @param style: the processed style attributes
  * @param children: the children to place within the element
  * @param passProps: other props that are to be passed into the element
  * @return a RN element that represents an image tag
  */
  img: (htmlAttribs, style, children, passProps) => {
    let width, height
    for (var i = style.length - 1; i >= 0; i--) {
      if (!width && style[i].width) { width = style[i].width }
      if (!height && style[i].height) { height = style[i].height }
      if (width && height) { break }
    }
    width = width === undefined ? 100 : width
    height = height === undefined ? 100 : height
    return (<Image source={{uri: htmlAttribs.src, width: width, height: height}} style={style} {...passProps} />)
  }
}
