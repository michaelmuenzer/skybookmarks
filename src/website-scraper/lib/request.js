import { promisify, resolve } from 'bluebird';
import { get as __get } from 'request';
const get = promisify(__get);
import default_util from './utils';
const { extend, isPlainObject } = default_util;

function getMimeType (contentType) {
	return contentType ? contentType.split(';')[0] : null;
}

function defaultResponseHandler ({response}) {
	return resolve(response.body);
}

function transformResult (result) {
	switch (true) {
		case typeof result === 'string':
			return {
				body: result,
				metadata: null
			};
		case isPlainObject(result):
			return {
				body: result.body,
				metadata: result.metadata || null
			};
		case result === null:
			return null;
		default:
			throw new Error('Wrong response handler result. Expected string or object, but received ' + typeof result);
	}
}

const _get = ({ url, referer, options = {}, afterResponse = defaultResponseHandler }) => {
	const requestOptions = extend(options, { url });

	if (referer) {
		requestOptions.headers = requestOptions.headers || {};
		requestOptions.headers.referer = referer;
	}

	console.log(`[request] sending request for url ${url}, referer ${referer}`);

	return get(requestOptions).then((response) => {
		console.log(`[request] received response for ${response.request.href}, statusCode ${response.statusCode}`);
		return afterResponse({ response })
			.then(transformResult)
			.then((responseHandlerResult) => {
				if (!responseHandlerResult) {
					return null;
				}
				return {
					url: response.request.href,
					mimeType: getMimeType(response.headers['content-type']),
					body: responseHandlerResult.body,
					metadata: responseHandlerResult.metadata
				};
			});
	});
};
export { _get as get };
