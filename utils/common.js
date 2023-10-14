export let baseUrl = 'http://192.168.1.1:8080'
export const common = {
	axios(options) {
		return new Promise((resolve, reject) => {
			let timer = ''
			if (options.showWaiting) {
				timer = setTimeout(() => {
					plus.nativeUI.showWaiting(
						options.showWaiting.title ? options.showWaiting.title : '加载中...',
						options.showWaiting.styles
					)
				}, 200)
			}
			const header = {}
			const tokenType = plus.storage.getItem('AD_token_type')
			const token = plus.storage.getItem('AD_token')
			if (tokenType && token) {
				header['Authorization'] = tokenType + ' ' + token
			}
			uni.request({
				url: baseUrl + '/' + options.url,
				data: options.data,
				method: options.method,
				header: {
					...header,
					...options.header
				},
				success: (res) => {
					const data = res.data
					if (data.code === 200) {
						resolve(data.data)
					}
				},
				fail: (err) => {
					console.error(options.url, err);
					plus.nativeUI.toast(err.errMsg)
					reject(err)
				},
				complete: (res) => {
					clearTimeout(timer)
					timer = ''
					const data = res.data

					const errCodeList = [100002, 401, 511]
					// 用户失效
					if (errCodeList.includes(data.code)) {
						common.logout()
					}

					if (data.code !== 200) {
						console.error(options.url, res, 'finish');
						plus.nativeUI.toast(data.message)
					}
					if (options.showWaiting) {
						plus.nativeUI.closeWaiting()
					}
				}
			})
		})
	},
	getJson(options) {
		let url = baseUrl
		if (options.port) {
			const regex = /(http:\/\/.*?)\:/ // 匹配端口号之前的字符串，包括"http://"
			const matches = regex.exec(baseUrl)
			if (matches && matches.length > 1) {
				url = matches[1] + ':' + options.port;
			}
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: url + '/' + options.url,
				success: (res) => {
					resolve(res.data)
				}
			})
		})
	},
	getOrganCode() {
		return plus.storage.getItem('AD_organCode')
	},
	logout() {
		plus.storage.clear()
		uni.reLaunch({
			url: '/pages/login/login'
		})
	},
	// 关闭可见的webview
	closeAllDisplayWebview() {
		const webviewList = plus.webview.getDisplayWebview();
		webviewList.forEach(item => {
			item.close()
		})
	}
}
