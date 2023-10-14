<template>
	<view class="page-wrapper">
		<view class="page-bar">
			<view class="bar-header">
				<view class="bar-icon">
					<image src="@/static/login/pad-logo.png" mode="widthFix" class="image"></image>
				</view>
			</view>
			<view class="bar-body">
				<view class="bar-tab" v-for="(item, index) in menuList" :class="{
						active: currentIndex === index
					}" @click="changeWebview(item, index)">
					<image :src="currentIndex === index ? item.activeIcon : item.defaultIcon" mode="widthFix"></image>
				</view>
			</view>
			<view class="bar-bottom">
				<!-- <business-avatar></business-avatar> -->
				<image :src="userInfo.picName ? baseUrlRef + userInfo.picName : defaultAvatar" mode="widthFix"
					@click="showLeftInfoToast"></image>
			</view>
		</view>
		<view class="page-body">
			<!-- web-view在这个位置 用plus生成 -->
		</view>
	</view>
</template>

<script setup>
	import workBenchActiveIcon from './images/workBench-active.png'
	import workBenchDefaultIcon from './images/workBench-default.png'
	import infoActiveIcon from './images/info-active.png'
	import infoDefaultIcon from './images/info-default.png'
	import defaultAvatar from './images/default-avatar.png'
	import {
		nextTick,
		onMounted,
		reactive,
		ref
	} from "vue";
	import {
		common,
		baseUrl
	} from "@/utils/common";
	import {
		onLoad,
		onShow,
		onHide,
		onUnload,
	} from '@dcloudio/uni-app'
	import appManager from '../../utils/appManager.js'
	import {
		getBarMenuApi
	} from "./api.js";
	import {
		useUserStore
	} from "../../stores/user.js";
	import {
		usePrimaryColor
	} from '../../hooks/usePrimaryColor';
	import {
		useCheckUpdate
	} from '../../hooks/useCheckUpdate';
	const userStore = useUserStore()
	const userInfo = userStore.userInfo
	const menuList = ref([{
		activeIcon: infoActiveIcon,
		defaultIcon: infoDefaultIcon,
		url: 'demo1'
	}, {
		activeIcon: workBenchActiveIcon,
		defaultIcon: workBenchDefaultIcon,
		url: 'demo2'
	}])
	const getBarMenu = () => {
		const params = {
			menuType: 'pad',
			topMenuCode: 'quality',
			organCode: common.getOrganCode(),
			wardCode: userStore.currentWard.wardCode
		}
		return getBarMenuApi(params)
	}

	const {
		startCheckUpdate
	} = useCheckUpdate()

	onLoad(async () => {
		await getBarMenu()

		changeWebview(menuList.value[1], 1, 1000)

		// 检测是否更新
		startCheckUpdate()
	})
	const currentIndex = ref(-1)
	const changeWebview = (row, index, time) => {
		currentIndex.value = index
		openWebview(row, time)
	}
	const webviewMap = {}
	const baseUrlRef = ref(baseUrl)
	let currentWebview = ''
	const openWebview = (row, time = 0) => {
		if (currentWebview) {
			currentWebview.hide('fade-out')
		}

		setTimeout(() => {
			const url = `${baseUrlRef.value}/${row.url}?deviceType=pad`
			if (webviewMap[url]) {
				webviewMap[url].show('slide-in-right')
			} else {
				const webview = appManager.createWebview({
					url,
					styles: {
						top: plus.navigator.getStatusbarHeight(),
						left: 64,
						right: 0,
						bottom: 0,
						backButtonAutoControl: 'none',
						progress: {
							color: usePrimaryColor().primaryColor.value
						}
					}
				})
				// 关闭弹窗
				webview.addEventListener('touchstart', () => {
					const subNVue = uni.getSubNVueById('personalPopup')
					subNVue.hide('slide-out-left', 300)
				})
				webview.show('slide-in-right')
				webviewMap[url] = webview
			}
			currentWebview = webviewMap[url]

		}, time)
	}

	const backListener = (e) => {
		console.log(123);
	}
	onShow(() => {
		plus.key.addEventListener('backbutton', backListener, false);
		if (currentWebview) {
			currentWebview.show('slide-in-right')
		}
	})
	onHide(() => {
		plus.key.removeEventListener('backbutton', backListener, false);
		console.log('indexHide');
		if (currentWebview) {
			currentWebview.hide('fade-out')
		}
	})
	const showLeftInfoToast = () => {
		// 通过 id 获取 nvue 子窗体
		const subNVue = uni.getSubNVueById('personalPopup')
		// 打开 nvue 子窗体
		subNVue.show('slide-in-left', 300, function() {
			// 打开后进行一些操作...
			//
		});
		// subNVue.setStyle({
		//     top: '100px',
		//     left: '20px',
		//     width: '100px',
		//     height: '50px',
		// })
		// 关闭 nvue 子窗体
		// subNVue.hide('fade-out', 300)

		// plus.nativeUI.toast('退出登录测试')
		// plus.storage.clear()
		// uni.reLaunch({
		// 	url: '/pages/login/login'
		// })
		// common.closeAllDisplayWebview()
	}



	// 过期token测试用
	// setTimeout(() => {
	// 	console.log('设置缓存');
	// 	plus.storage.setItem('AD_token_type', 'Bearer')
	// 	plus.storage.setItem('AD_token', '21482775-eea9-4b76-ad6f-868dc525e5b5')
	// }, 5000)
</script>

<style scoped lang="scss">
	.page-wrapper {
		background-color: #fff;
		padding-top: var(--status-bar-height);
		display: flex;
		height: 100%;
		box-sizing: border-box;
	}

	.page-bar {
		width: 62px;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 0 9px;
		box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.16);
	}

	.bar-header {
		.bar-icon {
			display: flex;
			justify-content: center;
			padding: 12px 0;
			border-bottom: 1px dashed #E3E3E3;

			.image {
				width: 25px;
			}
		}

	}

	.bar-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-bottom: 11.47rpx;

		.bar-tab {
			padding: 11px 14px;
			font-size: 9.44rpx;
			border-radius: 2.02rpx;
			transition: all 0.3s ease-out;

			image {
				width: 14px;
			}

			&:not(:last-child) {
				margin-bottom: 11.47rpx;
			}

			&.active {
				background-color: var(--primary-color);
			}
		}
	}


	.bar-bottom {
		padding: 0 10px 0;

		image {
			width: 25px;
		}
	}

	.page-body {
		height: 100%;
		flex: 1;
	}
</style>
