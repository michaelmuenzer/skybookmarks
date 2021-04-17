import * as Promise from "bluebird";
import Scraper from './lib/scraper.js';

export default (options, callback) => {
	
	return Promise.try(() => {
		return new Scraper(options).scrape(callback);
	});
};

export const defaults = Scraper.defaults;
