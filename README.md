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
