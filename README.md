[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
    <img width="600" src="https://d33wubrfki0l68.cloudfront.net/3c934afefb2da5f35adefb52716ba9cc9ffa37ab/061c6/img/layout/logo-babylonjs-v3.svg" alt="BabylonJS">
  </a>
  <h1>Babylon File Loader</h1>
  <p>Instructs webpack to emit the required object as a file and an accompanying manifest (if it exists)  and to return the file's public URL. This loader is based on the <a href="https://github.com/webpack-contrib/file-loader">official webpack file-loader</a> so it can handle other files than <code>.babylon</code> as well.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev babylon-file-loader
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

By default the filename of the resulting file is the MD5 hash of the file's contents with the original extension of the required resource.

```js
import scene from './scene.babylon'
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.babylon$/,
        use: [
          {
            loader: 'babylon-file-loader',
            options: {}  
          }
        ]
      }
    ]
  }
}
```

Emits `scene.babylon` and accompanying manifest (if it exists) as files in the output directory and returns the public URL

```
"/public/path/0dcbbaa7013869e351f.babylon"
"/public/path/0dcbbaa7013869e351f.babylon.manifest"
```

<h2 align="center">Options</h2>

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`name`**|`{String\|Function}`|`[hash].[ext]`|Configure a custom filename template for your file|
|**`context`**|`{String}`|`this.options.context`|Configure a custom file context, defaults to `webpack.config.js` [context](https://webpack.js.org/configuration/entry-context/#context)|
|**`publicPath`**|`{String\|Function}`|[`__webpack_public_path__ `](https://webpack.js.org/api/module-variables/#__webpack_public_path__-webpack-specific-)|Configure a custom `public` path for your files|
|**`outputPath`**|`{String\|Function}`|`'undefined'`|Configure a custom `output` path for your files|
|**`useRelativePath`**|`{Boolean}`|`false`|Should be `true` if you wish to generate a `context` relative URL for each file|
|**`emitFile`**|`{Boolean}`|`true`|By default a file is emitted, however this can be disabled if required (e.g. for server side packages)|

### `name`

You can configure a custom filename template for your file using the query parameter `name`. For instance, to copy a file from your `context` directory into the output directory retaining the full directory structure, you might use

#### `{String}`

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[path][name].[ext]'
  }  
}
```

#### `{Function}`

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name (file) {
      if (env === 'development') {
        return '[path][name].[ext]'
      }

      return '[hash].[ext]'
    }
  }  
}
```

#### `placeholders`

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`[ext]`**|`{String}`|`file.extname`|The extension of the resource|
|**`[name]`**|`{String}`|`file.basename`|The basename of the resource|
|**`[path]`**|`{String}`|`file.dirname`|The path of the resource relative to the `context`|
|**`[hash]`**|`{String}`|`md5`|The hash of the content, hashes below for more info|
|**`[N]`**|`{Number}`|``|The `n-th` match obtained from matching the current file name against the query param `regExp`|

#### `hashes`

`[<hashType>:hash:<digestType>:<length>]` optionally you can configure

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`hashType`**|`{String}`|`md5`|`sha1`, `md5`, `sha256`, `sha512`|
|**`digestType`**|`{String}`|`base64`|`hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`|
|**`length`**|`{Number}`|`9999`|The length in chars|

By default, the path and name you specify will output the file in that same directory and will also use that same URL path to access the file.

### `context`

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[path][name].[ext]',
    context: ''
  }  
}
```

You can specify custom `output` and `public` paths by using `outputPath`, `publicPath` and `useRelativePath`

### `publicPath`

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[path][name].[ext]',
    publicPath: 'assets/'
  }  
}
```

### `outputPath`

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[path][name].[ext]',
    outputPath: 'scenes/'
  }  
}
```

### `useRelativePath`

`useRelativePath` should be `true` if you wish to generate a relative URL to the for each file context.

```js
{
  loader: 'babylon-file-loader',
  options: {
    useRelativePath: process.env.NODE_ENV === "production"
  }
}
```

### `emitFile`

By default a file is emitted, however this can be disabled if required (e.g. for server side packages).

```js
import scene from './scene.babylon'
```

```js
{
  loader: 'babylon-file-loader',
  options: {
    emitFile: false
  }  
}
```

> ⚠️  Returns the public URL but does **not** emit a file

```
`${publicPath}/0dcbbaa701328e351f.babylon`
```

<h2 align="center">Examples</h2>


```js
import scene from './scene.babylon'
```

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: 'dirname/[hash].[ext]'
  }  
}
```

```
dirname/0dcbbaa701328ae351f.babylon
```
*Not returned but is emitted*
```
dirname/0dcbbaa701328ae351f.babylon.manifest
```

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[sha512:hash:base64:7].[ext]'
  }  
}
```

```
gdyb21L.babylon
```
*Not returned but is emitted*
```
gdyb21L.babylon.manifest
```

```js
import scene from 'path/to/scene.babylon'
```

**webpack.config.js**
```js
{
  loader: 'babylon-file-loader',
  options: {
    name: '[path][name].[ext]?[hash]'
  }  
}
```

```
path/to/scene.babylon?e43b20c069c4a01867c31e98cbce33c9
```
*Not returned but is emitted*
```
path/to/scene.babylon.manifest?e43b20c069c4a01867c31e98cbce33c9
```

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/swiftwork">
          <img width="150" height="150" src="https://github.com/swiftwork.png?v=3&s=150">
          </br>
          Erik Hughes
        </a>
      </td>
    </tr>
  <tbody>
</table>


[npm]: https://img.shields.io/npm/v/babylon-file-loader.svg
[npm-url]: https://npmjs.com/package/babylon-file-loader

[node]: https://img.shields.io/node/v/babylon-file-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/babylon-file-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/babylon-file-loader

[tests]: http://img.shields.io/travis/webpack-contrib/babylon-file-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/babylon-file-loader

[cover]: https://img.shields.io/codecov/c/github/webpack-contrib/babylon-file-loader.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/babylon-file-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
