import { parse, format, resolve } from 'url';
import { dirname as _dirname, relative, sep, basename, extname } from 'path';
import normalize from 'normalize-url';
import { decode, escape } from 'he';
import { unionWith, isEqual } from 'lodash';
import typeByMime from '../config/resource-type-by-mime';
import typeByExt from '../config/resource-type-by-ext';

const MAX_FILENAME_LENGTH = 255;
const IS_URL = /^((http[s]?:)?\/\/)/;

function isUrl (path) {
	return IS_URL.test(path);
}

function getUrl (currentUrl, path) {
	const pathObject = parse(path);
	if (isUrl(path) && !pathObject.protocol) {
		const urlObject = parse(currentUrl);
		pathObject.protocol = urlObject.protocol;
		path = format(pathObject);
	}
	return resolve(currentUrl, path);
}

function getUnixPath (filepath) {
	return filepath.replace(/\\/g, '/');
}

function getRelativePath (path1, path2) {
	const dirname = _dirname(path1);
	const relativePath = relative(dirname, path2);
	const escaped = relativePath
		.split(sep)
		.map(pathComponent => encodeURIComponent(pathComponent).replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16)))
		.join(sep);
	return getUnixPath(escaped);
}

/**
 * Returns decoded pathname from url
 * Example: https://example.co/path/logo%20(1).svg => /path/logo (1).svg
 * @param u - url
 * @returns {string} decoded pathname
 */
function getPathnameFromUrl (u) {
	const pathname = parse(u).pathname;
	try {
		return decodeURI(pathname);
	} catch (e) {
		return pathname;
	}
}

/**
 * Returns filename from given url
 * Example: http://example.com/some/path/file.js => file.js
 * @param {string} u - url
 * @returns {string} filename
 */
function getFilenameFromUrl (u) {
	return basename(getPathnameFromUrl(u));
}

/**
 * Returns relative path from given url
 * Example: http://example.com/some/path/file.js => some/path/file.js
 * @param {string} u - url
 * @returns {string} path
 */
function getFilepathFromUrl (u) {
	const nu = normalizeUrl(u, {removeTrailingSlash: true});
	return getPathnameFromUrl(nu).substring(1);
}

function getHashFromUrl (u) {
	return parse(u).hash || '';
}

/**
 * Returns host with port from given url
 * Example: http://example.com:8080/some/path/file.js => example.com:8080
 * @param {string} u - url
 * @returns {string} host with port
 */
function getHostFromUrl (u) {
	return parse(u).host;
}

/**
 * Returns extension for given filepath
 * Example: some/path/file.js => .js
 * @param {string} filepath
 * @returns {string|null} - extension
 */
function getFilenameExtension (filepath) {
	return (typeof filepath === 'string') ? extname(filepath).toLowerCase() : null;
}

function shortenFilename (filename) {
	if (filename.length >= MAX_FILENAME_LENGTH) {
		const shortFilename = filename.substring(0, 20) + getFilenameExtension(filename);
		console.log(`[utils] shorten filename: ${filename} -> ${shortFilename}`);
		return shortFilename;
	}
	return filename;
}

function reflect (promise) {
	return promise.then(v => v, e => e);
}

function waitAllFulfilled (promises) {
	return Promise.all(promises.map(reflect));
}

export function normalizeUrl (u, opts) {
	try {
		return normalize(u, extend({removeTrailingSlash: false, stripHash: true}, opts));
	} catch (e) {
		return u;
	}
}

function urlsEqual (url1, url2) {
	return normalizeUrl(url1) === normalizeUrl(url2);
}

function isUriSchemaSupported (path) {
	const protocol = parse(path).protocol;
	return !protocol || protocol && isUrl(path);
}

function getTypeByMime (mimeType) {
	return typeByMime[mimeType];
}

function getTypeByFilename (filename) {
	const ext = getFilenameExtension(filename);
	return typeByExt[ext];
}

function decodeHtmlEntities (text) {
	return typeof text === 'string' ? decode(text) : '';
}

function encodeHtmlEntities (text) {
	return typeof text === 'string' ? escape(text) : '';
}

function clone (obj) {
	return Object.assign({}, obj);
}

function extend (first, second) {
	return Object.assign({}, first, second);
}

function union (first, second) {
	return unionWith(first, second, isEqual);
}

function isPlainObject (value) {
	return value instanceof Object && Object.getPrototypeOf(value) === Object.prototype;
}

function prettifyFilename (filename, {defaultFilename}) {
	if (filename === defaultFilename || filename.endsWith('/' + defaultFilename)) {
		return filename.slice(0, -defaultFilename.length);
	}
	return filename;
}

export default {
	isUrl,
	getUrl,
	getUnixPath,
	getRelativePath,
	getFilenameFromUrl,
	getFilepathFromUrl,
	getFilenameExtension,
	getHashFromUrl,
	getHostFromUrl,
	shortenFilename,
	prettifyFilename,
	waitAllFulfilled,
	urlsEqual,
	isUriSchemaSupported,
	getTypeByMime,
	getTypeByFilename,
	decodeHtmlEntities,
	encodeHtmlEntities,
	clone,
	extend,
	union,
	isPlainObject
};
