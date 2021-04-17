import { parse, stringify } from 'srcset';
import { filter } from 'lodash';

class HtmlImgSrcSetTag {
	constructor (text) {
		this.text = text || '';
		this.imgSrcsetParts = parse(this.text);
		this.paths = this.imgSrcsetParts.map(imgSrcset => imgSrcset.url);
	}

	getPaths () {
		return this.paths;
	}

	updateText (pathsToUpdate) {
		const imgSrcsetParts = this.imgSrcsetParts;
		pathsToUpdate.forEach(function updatePath (path) {
			const srcsToUpdate = filter(imgSrcsetParts, {url: path.oldPath});
			srcsToUpdate.forEach((srcToUpdate) => {
				srcToUpdate.url = path.newPath;
			});
		});
		return stringify(imgSrcsetParts);
	}
}

export default HtmlImgSrcSetTag;
