/*
var Jex = {
	Tasks: {}
};

Jex.Tasks.CPS = new Class({
	
	inizialize:
	
	
});
*/

	exports.Error = Error;

	var path = require('path');
	exports.DS = path.normalize('/');
	exports.CORE = path.normalize(path.join(path.dirname(__filename), '..')) + exports.DS;
	exports.LIB = path.normalize(path.join(exports.CORE, '..')) + exports.DS;
	exports.ROOT = path.normalize(path.join(exports.CORE, '..', '..')) + exports.DS;
	exports.DEPRECATED = 0;
	exports.NOTICE = 1;
	exports.WARNING = 2;
	exports.ERROR = 3;
	exports.FATAL = 4;
	
	require.paths.push(exports.LIB);
	require('MooTools').apply(this);
	exports.Mootools = {
		Cloneable: require(require('path').join('MooTools', 'Cloneable.js'))
	};

	exports.Configure = new Class({
		//TODO: fill with methodes
	});

	exports.App = new Class({
		Implements: [exports.Mootools.Cloneable],
		initialize: function(App, Name) {

			this.ROOT = exports.CORE;
			if(App !== undefined) {
				this.ROOT = this.APP = App;
				this.APPNAME = path.basename(this.APP);
			}
			if(Name !== undefined) {
				this.APPNAME = Name;
			}
			this.paths = {
				plugin: {
					View: 'View' + exports.DS + 'plugins' + exports.DS,
					Package: 'Package' + exports.DS + 'plugins' + exports.DS
				},
				structure: {
					Controller: 'Controller' + exports.DS,
					Component: 'Controller' + exports.DS + 'Compontent',
					Model: 'Model',
					Behavior: 'Model' + exports.DS + 'Behavior',
					Datasource: 'Model' + exports.DS + 'Datasource',
					Package: 'Package',
					Utility: 'Utility',
					Lib: 'Lib',
					View: 'View',
					Helper: 'View' + exports.DS + 'Helper',
					config: 'config',
					files: 'files',
					vendors: 'vendors',
					webroot: 'webroot'
				},
				appjs: {
					Controller: 'Controller' + exports.DS,
					Component: 'Controller' + exports.DS + 'Compontent',
					Model: 'Model',
					Behavior: 'Model' + exports.DS + 'Behavior',
					Datasource: 'Model' + exports.DS + 'Datasource',
					Package: 'Package',
					Utility: 'Utility',
					View: 'View',
					Test: 'Test',
					Lib: '..',
					Helper: 'View' + exports.DS + 'Helper',
					config: 'config'
				},
				app: {
					plugins: 'plugins'
				},
				root: {
					Package: 'Package',
					plugins: 'plugins',
					vendors: 'vendors',
					Lib: 'lib'
				}
			};
			this.presets = {
				MooTools: ['Lib', 'MooTools'],
				Async: ['Lib', 'Async'],
				TestCase: ['Test', 'Utility' + exports.DS + 'TestCase']
			};
			
			var ClassRegistry = this.load('Utility', 'ClassRegistry');
			this.ClassRegistry = new ClassRegistry();
		},
		log: function(message, level) {
			var date = '';
			var app = '';
			if(this.APPNAME !== undefined) {
				app = '[' + this.APPNAME + ']: ';
			}
			console.log(date + app + message);
		},
		print: function(message, level) {
			this.log(message, level);
		},
		access: function(Request, level) {
			//TODO: Work a bit^^
			//127.0.0.1 - - [22/Mar/2011:15:32:18 +0100] "GET /css/ccss/Packagesc131679d8b94a7f32ae5ac44f8b81361.css HTTP/1.1" 304
			var ip = Request.connection.remoteAddress;
			//date = Date.format('r');
			var date = '';
			var method = Request.method;
			var url = Request.url;
			var protocol = 'HTTP/' + Request.httpVersion;
			var statuscode = '-';
			var user = '-';
			this.log(ip + ' ' + user + ' - ' + '[' + date + '] "' + method + ' ' + url + ' ' + protocol + '" ' + statuscode, level, 'access');
		},
		debug: function(message) {

		},
		pathExists: function(paths, name) {
			if(typeof paths == 'string') {
				paths = [paths];
			}
			if(name === undefined) {
				name = '';
			}
			var	path = require('path');
			var returnPath = false;
			paths.some(function(value) {
				//TODO: anyncron überarbeiten
				value = value + name;
				if(path.existsSync(value)) {
					returnPath = value;
					return true;
				}
				return false;
			});
			if(returnPath !== false) {
				//TODO: Append trailing slash if its a directory
				//var stat = require('fs').statSync('/');
				//console.log(stat);
			}
			return returnPath;
		},
		exists: function() {
			if(this.APP !== undefined) {
				return this.pathExists(this.APP);
			}
			return false;
		},
		joinPath: function(type, path, plugin) {
			var pathApi = require('path');

			//if we are in a App use App as plugin by default
			if(this.APP !== undefined) {
				var pluginPath = this.APP + exports.DS;
			}
			if(typeof plugin == 'string') {
				//change to the real plugin
				pluginPath = this.pluginPath(plugin);
			} else {
				plugin = '';
			}

			var ret = false;
			switch(type) {
				case 'structure':
					if(pluginPath !== undefined) {
						ret = pathApi.join(pluginPath, path) + exports.DS;
					}
					break;
				case 'appjs':
					if(!plugin) {
						ret = pathApi.join(exports.CORE, path) + exports.DS;
					}
					break;
				case 'plugin':
					if(plugin && this.APP !== undefined) {
						ret = pathApi.join(this.APP, path, plugin)
							+ exports.DS;
					}
					break;
				case 'app':
					if(this.APP !== undefined) {
						ret = pathApi.join(this.APP, path, plugin)
							+ exports.DS;
					}
					break;
				case 'root':
					if(!plugin) {
						ret = pathApi.join(exports.ROOT, path) + exports.DS;
					}
					break;
			}
			if(typeof ret == 'string') {
				ret = pathApi.normalize(ret);
			}
			return ret;
		},
		pluginPath: function(plugin) {
			var self = this;
			var paths = [];
			Object.each(this.paths, function(value, index) {
				if(value.plugins === undefined) {
					return;
				}
				paths.push(self.joinPath(index, value.plugins));
			});
			return this.pathExists(paths, plugin);
		},
		pluginSplit: function(string) {
			if(string.indexOf('.') > 0) {
				return [
					string.substr(0, string.indexOf('.')),
					string.substr(string.indexOf('.') + 1)
				];
			} else {
				return [false, string];
			}
		},
		path: function(type, plugin) {
			if(typeof plugin == 'undefined') {
				if(typeof type == 'undefined') {
					type = '';
				}
				return path.join(this.ROOT, type);
			}
			
			var returnPath = [];
			var self = this;
			Object.each(this.paths, function(value, index) {
				if(value[type] === undefined) {
					return;
				}
				value = value[type];
				var path = self.joinPath(index, value, plugin);
				if(path !== false) {
					returnPath.push(path);
				}
			});
			return returnPath;
		},
		load: function(type, name) {
			if(name === undefined) {
				if(type === undefined) {
					throw new exports.Error('No valid arguments', {
						arguments: arguments
					});
				}
				if(typeof this.presets[type] !== 'undefined') {
					name = this.presets[type][1];
					type = this.presets[type][0];
				} else {
					throw new exports.Error('Cannot find preset', {
						type: type
					});
				}
			}

			var tmp = this.pluginSplit(name);
			var plugin = tmp[0];
			name = tmp[1];
			
			var checkPaths = [
				[this.path(type, plugin), name + '.js']
			];
			
			if(type == 'Lib') {
				/**
				 * TODO: we are programmers.
				 * this looks like we can help ourself by do this in a loop.
				 */
				
				checkPaths.push([this.path(type, plugin), name + exports.DS + 'index.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + name.toLowerCase() + '.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + 'lib' + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + 'lib' + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name + exports.DS + 'lib' + exports.DS + name.toLowerCase() + '.js']);
				
				//underscore
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + 'index.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + name.toLowerCase() + '.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + 'lib' + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + 'lib' + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name.underscore() + exports.DS + 'lib' + exports.DS + name.toLowerCase() + '.js']);
				
				//lowercase
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + 'index.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + name.toLowerCase() + '.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + 'lib' + exports.DS + name + '.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + 'lib' + exports.DS + name.underscore() + '.js']);
				checkPaths.push([this.path(type, plugin), name.toLowerCase() + exports.DS + 'lib' + exports.DS + name.toLowerCase() + '.js']);
				
			}
			var self = this;
			var returnPath;
			var file;
			var args = Object.values(arguments);
			checkPaths.some(function(currentPath) {
				file = self.pathExists.apply(self, currentPath);
				if(file !== false) {
					var ret = require(file);
					if(typeof ret == 'function') {
						tmp = [];
						args.each(function(value, index) {
							if(index > 1) {
								tmp.push(value);
							}
						});
						args = tmp;
						args.unshift(module.exports);
						args.unshift(self);
						ret = ret.apply(self, args);
					}
					returnPath = ret;
					return true;
				}
				return false;
			});
			if(returnPath !== undefined) {
				return returnPath;
			}
			
			throw new exports.Error('Cannot load File: ' + name, {
				name: name,
				file: file
			});
		}
	});

	var App = new exports.App();
	App.print('Loading Server Class');
	exports.Server = App.load('Utility', 'Server');

	var ClassRegistry = App.load('Utility', 'ClassRegistry');
	exports.ClassRegistry = new ClassRegistry();
	
	var WatcherRegistry = App.load('Utility', 'WatcherRegistry');
	exports.WatcherRegistry = new WatcherRegistry();

	exports.Firefly = new Class({
		initialize: function() {

		},
		registerExchange: function(options) {
			options = Object.merge({
				app: exports.CORE + 'exchangeApp',
				name: 'exchangeApp'
			}, options);
			console.log(options);
			return this.registerApp(options);
		},
		registerApp: function(options) {
			options = Object.merge({
				Extends: exports.Server
			}, options);
			var server = new Class(options);
			App.print('Register app "' + options.name + '"');
			return new server();
		}
	});

