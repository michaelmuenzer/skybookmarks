import { resolve, map, bind } from 'bluebird';

import defaults, { request as _request } from './config/defaults';
import recursiveSources from './config/recursive-sources';
import Resource from './resource';
import PQueue from 'p-queue';

import { get } from './request';
import ResourceHandler from './resource-handler';

import utils from './utils';
const { extend, clone, union, urlsEqual, getTypeByMime, getTypeByFilename } = utils;
import NormalizedUrlMap from './utils/normalized-url-map';

const actionNames = [
	'beforeStart', 'afterFinish', 'error',
	'beforeRequest', 'afterResponse',
	'generateFilename',
	'getReference',
];

class Scraper {
	constructor (options) {
		this.normalizeOptions(options);
		console.log('init with options', this.options);

		this.applyPlugins(this.options.plugins);

		this.resourceHandler = new ResourceHandler(this.options, {
			requestResource: this.requestResource.bind(this),
			getReference: this.runActions.bind(this, 'getReference')
		});
		this.resources = this.options.urls.map(({url, filename}) => new Resource(url, filename));

		this.requestedResourcePromises = new NormalizedUrlMap(); // Map url -> request promise
		this.loadedResources = new NormalizedUrlMap(); // Map url -> resource
		this.requestQueue = new PQueue({concurrency: this.options.requestConcurrency});
	}

	normalizeOptions (options) {
		this.options = extend(defaults, options);
		this.options.request = extend(_request, options.request);

		const urls = Array.isArray(options.urls) ? options.urls : [options.urls];

		this.options.urls = urls.map((urlItem) => {
			if (typeof urlItem === 'string') {
				return { url: urlItem, filename: this.options.defaultFilename };
			} else {
				return {url: urlItem.url, filename: urlItem.filename || this.options.defaultFilename};
			}
		});

		if (this.options.subdirectories) {
			this.options.subdirectories.forEach((element) => {
				element.extensions = element.extensions.map((ext) => ext.toLowerCase());
			});
		}

		this.options.recursiveSources = recursiveSources;
		if (this.options.recursive) {
			this.options.sources = union(this.options.sources, this.options.recursiveSources);
		}

		this.options.plugins = this.options.plugins || [];
	}

	applyPlugins (plugins = []) {
		this.actions = {};
		actionNames.forEach(actionName => this.actions[actionName] = []);
		plugins.forEach(plugin => {
			console.log(`[plugin] apply plugin ${plugin.constructor.name}`);
			plugin.apply(this.addAction.bind(this));
		});
	}

	addAction (name, handler) {
		if (!actionNames.includes(name)) {
			throw new Error(`Unknown action "${name}"`);
		}
		console.log(`add action ${name}`);
		this.actions[name].push(handler);
	}

	loadResource (resource) {
		const url = resource.getUrl();

		if (this.loadedResources.has(url)) {
			console.log('found loaded resource for ' + resource);
		} else {
			console.log('add loaded resource ' + resource);
			this.loadedResources.set(url, resource);
		}
	}

	createNewRequest (resource) {
		const self = this;

		//TODO: Can this be moved to beforeRequest?
		//TODO: Use own proxy server, https://github.com/Rob--W/cors-anywhere/
		const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';
		const url = corsAnywhere + resource.getUrl();

		const requestPromise = resolve()
			.then(async () => {
				const referer = resource.parent ? resource.parent.getUrl() : null;
				const {requestOptions} = await this.runActions('beforeRequest', {resource, requestOptions: this.options.request});
				return this.requestQueue.add(() => get({
					url,
					referer,
					options: requestOptions,
					afterResponse: this.actions.afterResponse.length ? this.runActions.bind(this, 'afterResponse') : undefined
				}));
			}).then(async function requestCompleted (responseData) {
				if (!responseData) {
					console.log('no response returned for url ' + url);
					return null;
				}

				if (!urlsEqual(responseData.url, url)) { // Url may be changed in redirects
					console.log('url changed. old url = ' + url + ', new url = ' + responseData.url);

					if (self.requestedResourcePromises.has(responseData.url)) {
						return self.requestedResourcePromises.get(responseData.url);
					}

					resource.setUrl(responseData.url);
					self.requestedResourcePromises.set(responseData.url, requestPromise);
				}

				resource.setType(getTypeByMime(responseData.mimeType));

				const { filename } = await self.runActions('generateFilename', { resource, responseData });
				resource.setFilename(filename);

				// if type was not determined by mime we can try to get it from filename after it was generated
				if (!resource.getType()) {
					resource.setType(getTypeByFilename(filename));
				}

				if (responseData.metadata) {
					resource.setMetadata(responseData.metadata);
				}

				resource.setText(responseData.body);
				self.loadResource(resource); // Add resource to list for future downloading, see Scraper.waitForLoad
				return resource;
			}).catch(function handleError (err) {
				console.log('failed to request resource ' + resource);
				return self.handleError(err, resource);
			});

		self.requestedResourcePromises.set(url, requestPromise);
		return requestPromise;
	}

	async requestResource (resource) {
		const url = resource.getUrl();

		if (this.options.urlFilter && !this.options.urlFilter(url)) {
			console.log('filtering out ' + resource + ' by url filter');
			return null;
		}

		if (this.options.maxDepth && resource.getDepth() > this.options.maxDepth) {
			console.log('filtering out ' + resource + ' by depth');
			return null;
		}

		if (this.requestedResourcePromises.has(url)) {
			console.log('found requested resource for ' + resource);
			return this.requestedResourcePromises.get(url);
		}

		return this.createNewRequest(resource);
	}

	async runActions (actionName, params) {
		console.log(`run ${this.actions[actionName].length} actions ${actionName}`);

		let result = extend(params);
		for (let action of this.actions[actionName]) {
			if (typeof action === 'function') {
				result = await action(extend(params, result));
			}
		}
		return result;
	}

	async load () {
		return map(this.resources, this.requestResource.bind(this))
			.then(this.waitForLoad.bind(this));
	}

	// Returns a promise which gets resolved when all resources are loaded.
	// 1. Get all not saved resources and save them
	// 2. Recursion if any new not saved resource were added during this time. If not, loading is done.
	waitForLoad () {
		//const resourcesToSave = Array.from(this.loadedResources.values()).filter((r) => !r.isSaved());
		//const loadingIsFinished = resourcesToSave.length === 0;

		/*if (!loadingIsFinished) {
			return Promise
				.mapSeries(resourcesToSave, this.saveResource.bind(this))
				.then(this.waitForLoad.bind(this));
		}
		console.log('downloading is finished successfully');*/
		return resolve(this.resources);
	}

	async handleError (err, resource) {
		// ignore promise here, just notifying external code about resource error
		this.runActions('onResourceError', {resource, error: err});

		if (this.options.ignoreErrors) {
			console.log('ignoring error: ' + err.message);
			return null;
		}
		throw err;
	}

	async errorCleanup (error) {
		console.log('finishing with error: ' + error.message);
		await this.runActions('error', {error});
		throw error;
	}

	scrape (callback) {
		return bind(this)
			.then(() => this.runActions('beforeStart', {options: this.options, utils}))
			.then(this.load)
			.catch(this.errorCleanup)
			.finally(() => this.runActions('afterFinish'))
			.asCallback(callback);
	}
}

Scraper.defaults = clone(defaults);
Scraper.plugins = {
};

export default Scraper;
