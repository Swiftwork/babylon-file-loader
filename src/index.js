import fs from 'fs';
import path from 'path';
import loaderUtils from 'loader-utils';
import validateOptions from 'schema-utils';
import schema from './options.json';

export default function loader(content) {
  if (!this.emitFile) throw new Error('Babylon File Loader\n\nemitFile is required from module system');

  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'Babylon File Loader');

  const context = options.context || this.rootContext || (this.options && this.options.context);
  const callback = this.async();

  let url = loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = '';

  if (options.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = (
      typeof options.outputPath === 'function' ? options.outputPath(url) : options.outputPath
    );
  }

  const filePath = this.resourcePath;

  if (options.useRelativePath) {
    const issuerContext = (this._module && this._module.issuer
      && this._module.issuer.context) || context;

    const relativeUrl = issuerContext && path.relative(issuerContext, filePath).split(path.sep).join('/');

    const relativePath = relativeUrl && `${path.dirname(relativeUrl)}/`;
    // eslint-disable-next-line no-bitwise
    if (~relativePath.indexOf('../')) {
      outputPath = path.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = relativePath + url;
    }

    url = relativePath + url;
  } else if (options.outputPath) {
    // support functions as outputPath to generate them dynamically
    outputPath = typeof options.outputPath === 'function' ? options.outputPath(url) : options.outputPath + url;

    url = outputPath;
  } else {
    outputPath = url;
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(url)}`;

  if (options.publicPath !== undefined) {
    // support functions as publicPath to generate them dynamically
    publicPath = JSON.stringify(
      typeof options.publicPath === 'function' ? options.publicPath(url) : options.publicPath + url,
    );
  }

  const exportStatement = `module.exports = ${publicPath};`;

  if (options.emitFile === undefined || options.emitFile) {
    this.emitFile(outputPath, content);

    // load the optional manifest file
    fs.readFile(`${this.resourcePath}.manifest`, (err, manifest) => {
      if (err) return callback(null, exportStatement);

      const indexExtension = outputPath.indexOf('.babylon');
      if (indexExtension < 0) return callback(null, exportStatement);

      // add the manifest extension to the output file path
      const outputManifestPath = `${outputPath.slice(0, indexExtension + 8)}.manifest${outputPath.slice(indexExtension + 8)}`;

      // ensure Webpack knows that the manifest is an optional dependency
      if (this.dependency) this.dependency(`${this.resourcePath}.manifest`);
      this.emitFile(outputManifestPath, manifest);
      return callback(null, exportStatement);
    });
  }

  return callback(null, exportStatement);
}

export const raw = true;
