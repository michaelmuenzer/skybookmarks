import _, { map, includes } from 'lodash';
import { join, basename as _basename } from 'path';
import sanitizeFilename from 'sanitize-filename';
import { shortenFilename, getFilenameExtension, getFilenameFromUrl } from '../utils';
import typeExtensions from '../config/resource-ext-by-type';

export default function generateFilename (resource, {subdirectories, defaultFilename}, occupiedFileNames) {
	const occupiedNames = getSubDirectoryNames({subdirectories}).concat(occupiedFileNames);

	let filename = getFilenameForResource(resource, {subdirectories, defaultFilename});
	filename = shortenFilename(sanitizeFilename(filename, {replacement: '_'}));

	const extension = getFilenameExtension(filename);
	const directory = getDirectoryByExtension(extension, {subdirectories, defaultFilename});

	let currentFilename = join(directory, filename);
	const basename = _basename(filename, extension);
	let index = 1;

	while (occupiedNames.includes(currentFilename)) {
		currentFilename = join(directory, `${basename}_${index}${extension}`);
		index++;
	}

	return currentFilename;
};

function getFilenameForResource (resource, {defaultFilename}) {
	const preferredFilename = resource.getFilename();
	const urlFilename = getFilenameFromUrl(resource.getUrl());
	let filename = preferredFilename || urlFilename || defaultFilename;

	const resourceType = resource.getType();
	let extension = getFilenameExtension(filename);

	if (!extension && typeExtensions[resourceType]) {
		extension = typeExtensions[resourceType][0];
		filename += extension;
	}

	return filename;
}

function getSubDirectoryNames ({subdirectories}) {
	return map(subdirectories, function getDirectory (directory) { return directory.directory; });
}

function getDirectoryByExtension (extension, {subdirectories}) {
	return _(subdirectories)
		.filter(function matchesExtension (directory) { return includes(directory.extensions, extension); })
		.map(function getDirectory (directory) { return directory.directory; })
		.first() || '';
}
