import {
	baseUrl,
	common
} from '../utils/common'

export const compareVersion = (currVersion, targetVerison) => {
	if (!currVersion || !targetVerison) return false;
	const curr = currVersion.split('.');
	const target = targetVerison.split('.');
	for (let i = 0; i < curr.length; i++) {
		if (parseInt(curr[i]) > parseInt(target[i])) {
			return true
		}
		if (parseInt(curr[i]) < parseInt(target[i])) {
			return false
		}
		//相等继续
		//parseInt(curr[i]) == parseInt(target[i])  continue
	}
	return true
}
let apkUrl = ''
const startCheckUpdate = async () => {
	const json = await common.getJson({
		port: '8001',
		url: 'demo.json',
	})
	apkUrl = json.url
	uni.getSystemInfo().then(res => {
		if (!compareVersion(res.appWgtVersion, json.version)) {
			let content = json.describe.join('\n')
			uni.showModal({
				title: "版本更新",
				content,
				confirmText: '立即更新',
				cancelText: '稍后进行',
				success: (res) => {
					if (res.confirm) {
						update()
					}
				}
			})
		}
	})
}

// 开始更新
const update = () => {
	const loadingText = '下载中 请勿退出'
	let percent = 0
	const waitingObj = plus.nativeUI.showWaiting(`${loadingText} ${percent}%`);

	const downloadTask = plus.downloader.createDownload(baseUrl + '/nis-admin/' + apkUrl, {}, (download,
		status) => {
		if (status == 200) {
			plus.runtime.install(plus.io.convertLocalFileSystemURL(download.filename), {}, function() {
				console.log('安装成功');
			}, function(
				error) {
				uni.showToast({
					title: '安装失败',
					duration: 1500
				})
			})
		} else {
			uni.showToast({
				title: '更新失败',
				duration: 1500
			})
		}
	})
	downloadTask.start()

	let timer = setInterval(() => {
		console.log(downloadTask);
		if (downloadTask.totalSize) {
			percent = Math.floor((downloadTask.downloadedSize / downloadTask.totalSize).toFixed(2) *
				100) // fileSize文件总大小，后端返回的
			waitingObj.setTitle(`${loadingText} ${percent}%`)
			if (percent >= 100) {
				clearInterval(timer)
				waitingObj.close()
			}
		}
	}, 100)
}
export const useCheckUpdate = () => {
	return {
		startCheckUpdate,
		update,
	}
}
