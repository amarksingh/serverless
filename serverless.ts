const path = require('path');
const StreamRequest = require('./stream/request');
const StreamResponse = require('./stream/response');
const { resolveWithRequire } = require("./utils")
class Serverless {
	/**
	 * constructor method.
	 *
	 * @param {any} { serverless }
	 * @returns {any}
	 */
	constructor({ serverless }: any) {
		this.stream();
		const handler = this.handle()
		Object.defineProperties(this, {
			handler: {
				value: handler
			},
			$config: {
				value: serverless
			}
		});

		this.entry(resolveWithRequire(serverless.handler))
	}

	/**
	 * stream method.
	 *
	 * @param {any} request
	 * @param {any} response
	 * @returns {any}
	 */
	stream(request: any = StreamRequest, response: any = StreamResponse) {
		if (typeof request != 'function') {
			throw new Error('Request class must be function/class');
		}
		if (typeof response != 'function') {
			throw new Error('Response class must function/class');
		}
		Object.defineProperties(this, {
			$streamRequest: {
				value: request,
				writable: true,
				enumerable: false
			},
			$streamResponse: {
				value: response,
				writable: true,
				enumerable: false
			}
		});
	}

	/**
	 * request method.
	 *
	 * @param {any} HttpRequest
	 * @returns {any}
	 */
	request(HttpRequest: any) {
		if (typeof HttpRequest != 'function') {
			throw new Error('HttpRequest class must be function/class')
		}
		Object.defineProperty(this, '$request', { value: HttpRequest })
	}

	/**
	 * response method.
	 *
	 * @param {any} HttpResponse
	 * @returns {any}
	 */
	response(HttpResponse: any) {
		if (typeof HttpResponse != 'function') {
			throw new Error('HttpResponse class must function/class')
		}
		Object.defineProperty(this, '$response', { value: HttpResponse })
	}

	/**
	 * register method.
	 *
	 * @param {any} handler
	 * @returns {any}
	 */
	register(handler: Function) {
		Object.defineProperty(this, '$handler', { value: handler })
	}

	/**
	 * handle method.
	 *
	 * @returns {any}
	 */
	handle() {
		return (event, context) => {
			return new Promise((resolve) => {
				const serverlessPlateform = this.$config.platform || "generic";
				const serverlessGetway = this.$config.gateway;
				const request = new this.$request(new this.$streamRequest(event, context, serverlessPlateform, serverlessGetway));
				const response = new this.$response(new this.$streamResponse(resolve, serverlessPlateform, serverlessGetway))
				Object.defineProperty(response, 'request', { value: request })
				this.$handler(request, response, (err) => {
					response.send(err)
				});
			});
		};
	}

	/**
	 * entry method.
	 *
	 * @param {any} entryPath
	 * @returns {any}
	 */
	entry(entryPath: any) {
		if (entryPath) {
			this.loadMainModule(entryPath);
		}
	}

	/**
	 * loadMainModule method.
	 *
	 * @param {any} mainModulePath
	 * @returns {any}
	 */
	loadMainModule(mainModulePath: any) {
		const mainPath = path.resolve(mainModulePath);
		const mainModule = require(mainPath);
		const cachedModule = require.cache[mainPath];
		const desc = Object.getOwnPropertyDescriptor(require, 'main');
		if (!desc || desc.configurable) {
			const descriptor = {
				value: cachedModule,
				writable: true,
				configurable: true,
				enumerable: true
			};
			Object.defineProperty(require, 'main', descriptor);
		}

		process.mainModule = require.main;

		return mainModule;
	}
}

module.exports = Serverless;
