<script setup>
	import {onLaunch, onShow} from '@dcloudio/uni-app'
	import {
		common,
	} from "@/utils/common";
	import {
		useUserStore
	} from "@/stores/user";
	const userStore = useUserStore()
	onLaunch(() => {
		const token = plus.storage.getItem('AD_token')
		const userInfo = plus.storage.getItem('userInfo')
		if (userInfo) {
			userStore.$patch({userInfo: JSON.parse(userInfo)})
		}
		
		const currentWard = plus.storage.getItem('AD_wardInfo')
		if (currentWard) {
			userStore.$patch({currentWard: JSON.parse(currentWard)})
		}
		
		// 监听webview页面退出登录postmessage
		plus.globalEvent.addEventListener('plusMessage', (res) => {
			const arg = res.data.args.data.arg
			if (arg && arg.type === 'logout') {
				console.log('plusMessage 退出登录');
				common.logout()
			}
		})
		console.log('App Launch')
	})
	
</script>

<style>
	/*每个页面公共css */
	:root {
		color: #333333;
		font-size: 9.44rpx;
		--primary-color: #0F9096
	}
</style>