# babylon file loader for webpack

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

``` javascript
var url = require("babylon!./scene.babylon");
// => emits scene.babylon as file in the output directory and returns the public url
// => returns i. e. "/public-path/0dcbbaa701328a3c262cfd45869e351f.babylon"
```

By default the filename of the resulting file is the MD5 hash of the file's contents 
with the original extension of the required resource.

If any babylon files are accompanied by manifest files these will also be emitted to the
same public path, but with the manifest extension.

By default a file is emitted, however this can be disabled if required (e.g. for server
side packages).

``` javascript
var url = require("file?emitFile=false!./scene.babylon");
// => returns the public url but does NOT emit a file
// => returns i. e. "/public-path/0dcbbaa701328a3c262cfd45869e351f.babylon"
```

## Filename templates

You can configure a custom filename template for your file using the query
parameter `name`. For instance, to copy a file from your `context` directory
into the output directory retaining the full directory structure, you might
use `?name=[path][name].[ext]`.

### Filename template placeholders

* `[ext]` the extension of the resource
* `[name]` the basename of the resource
* `[path]` the path of the resource relative to the `context` query parameter or option.
* `[hash]` the hash of the content, `hex`-encoded `md5` by default
* `[<hashType>:hash:<digestType>:<length>]` optionally you can configure
  * other `hashType`s, i. e. `sha1`, `md5`, `sha256`, `sha512`
  * other `digestType`s, i. e. `hex`, `base26`, `base32`, `base36`, `base49`, `base52`, `base58`, `base62`, `base64`
  * and `length` the length in chars
* `[N]` the N-th match obtained from matching the current file name against the query param `regExp`

## Examples

``` javascript
require("file?name=models/[hash].mesh.[ext]!./models.babylon");
// => models/0dcbbaa701328a3c262cfd45869e351f.mesh.babylon

require("file?name=tree-[hash:6].babylon!./tree.babylon");
// => tree-109fa8.babylon

require("file?name=[hash]!./scene.babylon");
// => c31e9820c001c9c4a86bce33ce43b679

require("file?name=[sha512:hash:base64:7].[ext]!./scene.babylon");
// => gdyb21L.babylon
// use sha512 hash instead of md5 and with only 7 chars of base64

require("file?name=scene-[sha512:hash:base64:7].[ext]!./scene.babylon");
// => scene-VqzT5ZC.babylon
// use custom name, sha512 hash instead of md5 and with only 7 chars of base64

require("file?name=cameras.babylon!./scene.babylon");
// => cameras.babylon

require("file?name=[path][name].[ext]?[hash]!./dir/scene.babylon")
// => dir/scene.babylon?e43b20c069c4a01867c31e98cbce33c9
```

## Installation

```npm install babylon-file-loader --save-dev```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)

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
  </a>
  <h1>Babylon File Loader</h1>
  <p>Instructs webpack to emit the required object as file and to return its public URL</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev file-loader
```

<h2 align="center"><a href="https://webpack.js.org/concepts/loaders">Usage</a></h2>

By default the filename of the resulting file is the MD5 hash of the file's contents with the original extension of the required resource.

```js
import img from './file.png'
```

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      }
    ]
  }
}
```

Emits `file.png` as file in the output directory and returns the public URL

```
"/public/path/0dcbbaa7013869e351f.png"
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
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]'
  }  
}
```

#### `{Function}`

**webpack.config.js**
```js
{
  loader: 'file-loader',
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
  loader: 'file-loader',
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
  loader: 'file-loader',
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
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]',
    outputPath: 'images/'
  }  
}
```

### `useRelativePath`

`useRelativePath` should be `true` if you wish to generate a relative URL to the for each file context.

```js
{
  loader: 'file-loader',
  options: {
    useRelativePath: process.env.NODE_ENV === "production"
  }
}
```

### `emitFile`

By default a file is emitted, however this can be disabled if required (e.g. for server side packages).

```js
import img from './file.png'
```

```js
{
  loader: 'file-loader',
  options: {
    emitFile: false
  }  
}
```

> ⚠️  Returns the public URL but does **not** emit a file

```
`${publicPath}/0dcbbaa701328e351f.png`
```

<h2 align="center">Examples</h2>


```js
import png from 'image.png'
```

**webpack.config.js**
```js
{
  loader: 'file-loader',
  options: {
    name: 'dirname/[hash].[ext]'
  }  
}
```

```
dirname/0dcbbaa701328ae351f.png
```

**webpack.config.js**
```js
{
  loader: 'file-loader',
  options: {
    name: '[sha512:hash:base64:7].[ext]'
  }  
}
```

```
gdyb21L.png
```

```js
import png from 'path/to/file.png'
```

**webpack.config.js**
```js
{
  loader: 'file-loader',
  options: {
    name: '[path][name].[ext]?[hash]'
  }  
}
```

```
path/to/file.png?e43b20c069c4a01867c31e98cbce33c9
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


[npm]: https://img.shields.io/npm/v/file-loader.svg
[npm-url]: https://npmjs.com/package/file-loader

[node]: https://img.shields.io/node/v/file-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack-contrib/file-loader.svg
[deps-url]: https://david-dm.org/webpack-contrib/file-loader

[tests]: http://img.shields.io/travis/webpack-contrib/file-loader.svg
[tests-url]: https://travis-ci.org/webpack-contrib/file-loader

[cover]: https://img.shields.io/codecov/c/github/webpack-contrib/file-loader.svg
[cover-url]: https://codecov.io/gh/webpack-contrib/file-loader

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
