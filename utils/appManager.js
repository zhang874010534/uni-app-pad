const class2type = {};
const appManager = {
	createWebview(options) {
		const webview = plus.webview.create(options.url, options.id, options.styles)
		return webview
	},
	openWindow(options) {
		const webview = plus.webview.open(options.url, options.id, options.styles, options.aniShow)
		// webview.show()
		return webview
	},
	fire(webview, eventType, data) {
		if (webview) {
			if (typeof data === 'undefined') {
				data = '';
			} else if (typeof data === 'boolean' || typeof data === 'number') {
				webview.evalJS("typeof mui!=='undefined'&&mui.receive('" + eventType + "'," + data + ")");
				return;
			} else if (this.isPlainObject(data) || Array.isArray(data)) {
				data = JSON.stringify(data || {}).replace(/\'/g, "\\u0027").replace(/\\/g, "\\u005c");
			}
			webview.evalJS("typeof mui!=='undefined'&&mui.receive('" + eventType + "','" + data + "')");
		}
	},
	isPlainObject(obj) {
		return this.isObject(obj) && !this.isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
	},
	isObject (obj) {
		return this.type(obj) === "object";
	},
	type (obj) {
		return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || "object";
	},
	isWindow (obj) {
		return obj != null && obj === obj.window;
	}
}
export default appManager
