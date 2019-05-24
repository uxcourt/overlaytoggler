# symbol-overlay-toggle

## Toggle Symbol Overlays
This Sketch plug-in seeks specifically named overrides for symbols sourced from a master library, and toggles a style setting to make those overrides visible or hidden. We use it to embed meaningful development spec information invisibly within Sketch symbols, and turn on the overlays when we pass the comps off to developers. Think of it as custom redlines, which describe the CSS properties necessary to achieve the result within an established code library. Instead of specifying each atomic formatting value, we give the style a name. This plug in will allow you to store those style names as overlays on the symbols and toggle them on or off with a click on the menu.

## Usage
This looks in a linked symbol library for layer styles named "o.overlay" and "o.invisible", and for text styles named "o.className hidden" and "o.className shown". If it finds a symbol on the current page which has an override affected layer named "o.overlay", it will apply the opposite layer style (if currently o.invisible, flip the style to o.overlay). If it finds a symbol on the current page which has an override addected layer named o.className, it will similarly flip that style.

One bug in the current build is that, once per file, you must manually apply the styles from the library to your local file. 

The script only operates on the current page of your Sketch file.

If you're curious about how it works, download the source file and edit the script to "debug=true", then watch your console for what the script is doing. If you need to change the names of the layer styles, text styles, or affected layers, they're all stored in constants at the top of the script.

## Installation

- [Download](../../releases/latest/download/symbol-overlay-toggle.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on symbol-overlay-toggle.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Custom Configuration

#### Babel

To customize Babel, you have two options:

- You may create a [`.babelrc`](https://babeljs.io/docs/usage/babelrc) file in your project's root directory. Any settings you define here will overwrite matching config-keys within skpm preset. For example, if you pass a "presets" object, it will replace & reset all Babel presets that skpm defaults to.

- If you'd like to modify or add to the existing Babel config, you must use a `webpack.skpm.config.js` file. Visit the [Webpack](#webpack) section for more info.

#### Webpack

To customize webpack create `webpack.skpm.config.js` file which exports function that will change webpack's config.

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {boolean} isPluginCommand - whether the config is for a plugin command or a resource
 **/
module.exports = function(config, isPluginCommand) {
  /** you can change config here **/
}
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

### Publishing your plugin

```bash
skpm publish <bump>
```

(where `bump` can be `patch`, `minor` or `major`)

`skpm publish` will create a new release on your GitHub repository and create an appcast file in order for Sketch users to be notified of the update.

You will need to specify a `repository` in the `package.json`:

```diff
...
+ "repository" : {
+   "type": "git",
+   "url": "git+https://github.com/ORG/NAME.git"
+  }
...
```
