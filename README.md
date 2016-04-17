# react-native-fence-html

A react native component that renders HTML as native views. Incredibly useful for rendering user inputted text from wysiwyg editors

![Screenshot](https://raw.githubusercontent.com/Thomas101/react-native-fence-html/master/gh-images/preview.jpg "Screenshot")

## Add it to your project
```
npm install react-native-fence-html --save
```

## Usage

```js
import HTML from 'react-native-fence-html'

...

render() {
	// The html you want to render
	const html = `
		<div>
			<h1>A Sample H1 Title</h1>
			<h2>A Sample H2 Title</h2>
			...
		</div>
	`
	
	const styles = {
		h1: { backgroundColor: '#FF0000' },
		h2: { fontFamily: 'Arial' }
	}
	
	return (
		<HTML
			// Required. The html snippet you want to render as a string
			html={html}
			
			// The styles to supply for each html tag. Default styles
			// are already pre-provided in HTMLStyles.js. The additional
			// styles that you provide will be merged over these, so if
			// you need some funky red background on your h1, just set
			// the background
			htmlStyles={styles}
			
			// Callback for when the user taps on a link. Oh look! You
			// get the href passed back. Handy if you want to send
			// someone somewhere :-)
			onLinkPress={(evt, href) => console.log(href)} />
	)
}
```

## Features

| Feature | |
| ------------- | ------------- |
| iOS  | ✔️ |
| Android  | ✔️ |
| Faster than webview  | ✔️ |
| Native views  | ✔️ |
| Inline-styles  | ✔️ |
| Custom stylesheet  | ✔️ |
| Tag-soup  | ✔️ |
| Links  | ✔️ |

## Demo

[Pull the demo repository to give it a try!](https://github.com/Thomas101/react-native-fence-html-demo)
