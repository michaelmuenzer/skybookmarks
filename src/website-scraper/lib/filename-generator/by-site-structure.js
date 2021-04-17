import { includes, last } from 'lodash';
import { join, parse, sep, normalize } from 'path';
import { parse as _parse } from 'url';
import sanitizeFilename from 'sanitize-filename';
import { getHostFromUrl, getFilepathFromUrl, getFilenameExtension, shortenFilename } from '../utils';
import { html } from '../config/resource-types';
import resourceTypeExtensions from '../config/resource-ext-by-type';

export default function generateFilename (resource, {defaultFilename}) {
	const resourceUrl = resource.getUrl();
	const host = getHostFromUrl(resourceUrl);
	const urlParsed = _parse(resourceUrl);
	let filePath = getFilepathFromUrl(resourceUrl);
	const extension = getFilenameExtension(filePath);

	filePath = join(host, filePath);

	// If have query string
	if (urlParsed.query) {
		const parsed = parse(filePath);
		const basename = join(parsed.dir, parsed.name);
		// Use the query string as file name in the site structure directory
		if (!extension) {
			// Without extension: http://example.com/path?q=test => path/q=test
			filePath = `${basename}${sep}${urlParsed.query}`;
		} else {
			// With extension: http://example.com/path/picture.png?q=test => path/picture_q=test.png
			filePath = `${basename}_${urlParsed.query}${extension}`;
		}
	}

	// If we have HTML from 'http://example.com/path' => set 'path/index.html' as filepath
	if (resource.isHtml()) {
		const htmlExtensions = resourceTypeExtensions[html];
		const resourceHasHtmlExtension = includes(htmlExtensions, extension);
		// add index.html only if filepath has ext != html '/path/test.com' => '/path/test.com/index.html'
		if (!resourceHasHtmlExtension) {
			if (!urlParsed.query) {
				// Without query string: http://example.com/path => path/index.html
				filePath = join(filePath, defaultFilename);
			} else {
				// With query string: http://example.com/path?q=test => path/q=test.html
				filePath = `${filePath}.html`;
			}
		}
	}

	return sanitizeFilepath(filePath);
};

function sanitizeFilepath (filePath) {
	filePath = normalize(filePath);
	const pathParts = filePath.split(sep).map(pathPart => sanitizeFilename(pathPart, {replacement: '_'}));
	pathParts[pathParts.length - 1] = shortenFilename(last(pathParts));
	return pathParts.join(sep);
}
