/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra modified by Erik Hughes @swiftwork
*/
var fs = require('fs');
var loaderUtils = require('loader-utils');

module.exports = function(content) {
	var loaderContext = this;
  var callback = loaderContext.async();
  
	loaderContext.cacheable && loaderContext.cacheable();
	if(!loaderContext.emitFile) throw new Error('emitFile is required from module system');

	var query = loaderUtils.parseQuery(loaderContext.query);
	var configKey = query.config || 'babylonLoader';
	var options = loaderContext.options[configKey] || {};

	var config = {
		publicPath: false,
		name: '[hash].[ext]'
	};

	// Options takes precedence over config
	Object.keys(options).forEach(function(attr) {
		config[attr] = options[attr];
	});

	// Query takes precedence over config and options
	Object.keys(query).forEach(function(attr) {
		config[attr] = query[attr];
	});

	var url = loaderUtils.interpolateName(loaderContext, config.name, {
		context: config.context || loaderContext.options.context,
		content: content,
		regExp: config.regExp
	});

	var publicPath = '__webpack_public_path__ + ' + JSON.stringify(url);

	if (config.publicPath) {
		// Support functions as publicPath to generate them dynamically
		publicPath = JSON.stringify(
				typeof config.publicPath === 'function' 
				 ? config.publicPath(url) 
				 : config.publicPath + url
		);
	}


	if (query.emitFile === undefined || query.emitFile) {
		loaderContext.emitFile(url, content);
		var result = 'module.exports = ' + publicPath + ';'

		// Load the optional manifest file
    fs.readFile(loaderContext.resourcePath + '.manifest', function (err, manifest) {
    	if (err) return callback(null, result);

    	// Ensure Webpack knows that the manifest is an optional dependency
    	loaderContext.dependency && loaderContext.dependency(loaderContext.resourcePath + '.manifest');
    	loaderContext.emitFile(url + '.manifest', manifest)
    	return callback(null, result)
    });
	}
}
module.exports.raw = true;
