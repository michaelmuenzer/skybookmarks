import { startsWith, find } from 'lodash';
import utils from '../../utils';

function getPaths (text) {
	const isSamePageId = startsWith(text, '#');
	const isUriSchemaSupported = utils.isUriSchemaSupported(text);
	if (isSamePageId || !isUriSchemaSupported) {
		return [];
	}
	return [text];
}

class HtmlCommonTag {
	constructor (text) {
		this.text = text || '';
		this.paths = getPaths(this.text);
	}

	getPaths () {
		return this.paths;
	}

	updateText (pathsToUpdate) {
		const pathToUpdate = find(pathsToUpdate, {oldPath: this.paths[0]});
		return pathToUpdate ? pathToUpdate.newPath : this.text;
	}
}

export default HtmlCommonTag;

