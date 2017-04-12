import { StyleSheet } from 'react-native'
import React from 'react'

// We have to do some munging here as the objects are wrapped
import _RNTextStylePropTypes from 'react-native/Libraries/Text/TextStylePropTypes'
import _RNViewStylePropTypes from 'react-native/Libraries/Components/View/ViewStylePropTypes'
import _RNImageStylePropTypes from 'react-native/Libraries/Image/ImageStylePropTypes'
const RNTextStylePropTypes = Object.keys(_RNTextStylePropTypes)
  .reduce((acc, k) => { acc[k] = _RNTextStylePropTypes[k]; return acc }, {})
const RNViewStylePropTypes = Object.keys(_RNViewStylePropTypes)
  .reduce((acc, k) => { acc[k] = _RNViewStylePropTypes[k]; return acc }, {})
const RNImageStylePropTypes = Object.keys(_RNImageStylePropTypes)
  .reduce((acc, k) => { acc[k] = _RNImageStylePropTypes[k]; return acc }, {})

const STYLESETS = Object.freeze({
  VIEW: 'view',
  TEXT: 'text',
  IMAGE: 'image'
})

const stylePropTypes = {}
stylePropTypes[STYLESETS.VIEW] = Object.assign({}, RNViewStylePropTypes)
stylePropTypes[STYLESETS.TEXT] = Object.assign({}, RNViewStylePropTypes, RNTextStylePropTypes)
stylePropTypes[STYLESETS.IMAGE] = Object.assign({}, RNViewStylePropTypes, RNImageStylePropTypes)

class HTMLStyles {

  /* ****************************************************************************/
  // Lifecycle
  /* ****************************************************************************/

  constructor () {
    this.defaultStyles = this._generateDefaultStyles()

    // RN doesn't support css 'display:inline|block' so we have to treat these differently
    this.blockElements = [
      'div', 'ol', 'ul'
    ].reduce((acc, n) => { acc.add(n); return acc }, new Set())
  }

  /* ****************************************************************************/
  // Properties
  /* ****************************************************************************/

  get STYLESETS () { return STYLESETS }

  /* ****************************************************************************/
  // Generating
  /* ****************************************************************************/

  /**
  * Small utility for generating heading styles
  * @param baseFontSize: the basic font size
  * @param fontMultiplier: the amount to multiply the font size by
  * @param marginMultiplier: the amount to multiply the margin by
  * @return a style def for a heading
  */
  _generateHeadingStyle (baseFontSize, fontMultiplier, marginMultiplier) {
    return {
      fontSize: baseFontSize * fontMultiplier,
      marginTop: (baseFontSize * fontMultiplier) * marginMultiplier,
      marginBottom: (baseFontSize * fontMultiplier) * marginMultiplier,
      fontWeight: 'bold'
    }
  }

  /**
  * Generates the default styles
  * @return the stylesheet
  */
  _generateDefaultStyles () {
    // These styles are mainly adapted from
    // https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css

    const BASE_FONT_SIZE = 14
    return StyleSheet.create({
      // Block level elements
      div: { },

      // Typography
      p: {
        fontSize: BASE_FONT_SIZE,
        marginTop: BASE_FONT_SIZE,
        marginBottom: BASE_FONT_SIZE
      },
      u: { textDecorationLine: 'underline' },
      em: { fontStyle: 'italic' },
      b: { fontWeight: 'bold' },
      strong: { fontWeight: 'bold' },
      big: { fontSize: BASE_FONT_SIZE * 1.2 },
      small: { fontSize: BASE_FONT_SIZE * 0.8 },
      a: {
        textDecorationLine: 'underline',
        color: '#245dc1'
      },

      // Typography : Headers
      h1: this._generateHeadingStyle(BASE_FONT_SIZE, 2, 0.67),
      h2: this._generateHeadingStyle(BASE_FONT_SIZE, 1.5, 0.83),
      h3: this._generateHeadingStyle(BASE_FONT_SIZE, 1.17, 1),
      h4: this._generateHeadingStyle(BASE_FONT_SIZE, 1, 1.33),
      h5: this._generateHeadingStyle(BASE_FONT_SIZE, 0.83, 1.67),
      h6: this._generateHeadingStyle(BASE_FONT_SIZE, 0.67, 2.33),

      // Typography : Lists
      ul: {
        paddingLeft: 40,
        marginBottom: BASE_FONT_SIZE
      },
      ol: {
        paddingLeft: 40,
        marginBottom: BASE_FONT_SIZE
      },

      // Typography : Breaks
      br: {

      },
      hr: {
        marginTop: BASE_FONT_SIZE / 2,
        marginBottom: BASE_FONT_SIZE / 2,
        height: 1,
        backgroundColor: '#CCC'
      }
    })
  }

  /* ****************************************************************************/
  // Converting
  /* ****************************************************************************/

  /**
  * Converts a html style string to an object
  * @param str: the style string
  * @return the style as an obect
  */
  cssStringToObject (str) {
    return str
      .split(';')
      .map((prop) => prop.split(':'))
      .reduce((acc, prop) => {
        if (prop.length === 2) {
          acc[prop[0].trim()] = prop[1].trim()
        }
        return acc
      }, {})
  }

  /**
  * Converts a html style to its equavalent react native style
  * @param: css: object of key value css strings
  * @param styleset: the styleset to convert the styles against
  * @return an object of react native styles
  */
  cssToRNStyle (css, styleset) {
    const styleProps = stylePropTypes[styleset]
    return Object.keys(css)
      .map((key) => [key, css[key]])
      .map(([key, value]) => {
        // Key convert
        return [
          key
            .split('-')
            .map((item, index) => index === 0 ? item : item[0].toUpperCase() + item.substr(1))
            .join(''),
          value]
      })
      .map(([key, value]) => {
        if (!styleProps[key]) { return undefined }

        const testStyle = {}
        testStyle[key] = value
        if (styleProps[key](testStyle, key, '', 'prop')) {
          // See if we can convert a 20px to a 20 automagically
          if (styleProps[key] === React.PropTypes.number) {
            const numericValue = parseFloat(value.replace('px', ''))
            if (!isNaN(numericValue)) {
              testStyle[key] = numericValue
              if (!styleProps[key](testStyle, key, '', 'prop')) {
                return [key, numericValue]
              }
            }
          }
          return undefined
        }
        return [key, value]
      })
      .filter((prop) => prop !== undefined)
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})
  }

  /**
  * @param str: the css style string
  * @param styleset=STYLESETS.TEXT: the styleset to convert the styles against
  * @return a react native style object
  */
  cssStringToRNStyle (str, styleset = STYLESETS.TEXT) {
    return this.cssToRNStyle(this.cssStringToObject(str), styleset)
  }
}

module.exports = new HTMLStyles()
