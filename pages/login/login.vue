<template>
	<view class="page-wrapper">
		<view class="page-body">
			<view class="login-bg">
				<image src="@/static/login/login-bg.png" mode="heightFix" style="height: 100%;"></image>
			</view>
			<view class="company-logo">
				<image src="@/static/login/company-logo.png" mode="widthFix" style="width: 68.83rpx;"></image>
			</view>
			<view class="login-wrapper">
				<view class="login-logo">
					<image src="@/static/login/pad-logo.png" mode="widthFix" style="width: 12.15rpx;"></image>
					<view class="login-text">
						demo1
					</view>
				</view>
				<view class="login-title">
					11
				</view>
				<view class="login-form">
					<uni-forms :modelValue="formData">
						<uni-forms-item name="loginName">
							<view class="form-label">
								<view class="form-circle"></view>
								<view class="form-name">
									22
								</view>
								<view class="form-english-name">
									Job Number
								</view>
							</view>
							<uni-easyinput type="text" v-model="formData.loginName" placeholder="请输入工号"
								:primary-color="primaryColor" confirmType="next" @confirm="confirmLoginName" />
						</uni-forms-item>
						<uni-forms-item name="password">
							<view class="form-label">
								<view class="form-circle"></view>
								<view class="form-name">
									33
								</view>
								<view class="form-english-name">
									Password
								</view>
							</view>
							<uni-easyinput ref="passwordRef" type="password" v-model="formData.password"
								placeholder="请输入密码" :primary-color="primaryColor" @confirm="confirmPassword" />
						</uni-forms-item>
						<button type="primary" class="login-button" @click="login">登录</button>
					</uni-forms>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref
	} from "vue";
	import {
		usePrimaryColor
	} from "../../hooks/usePrimaryColor";
	import {
		useUserStore
	} from "../../stores/user";
	import {
		common
	} from "../../utils/common";
	import encrypt from "../../utils/encrypt";
	import {
		getDefaultOrganCodeApi,
		getUserInfoApi,
		loginApi
	} from "./api";

	import {
		onShow
	} from '@dcloudio/uni-app'


	const formData = reactive({
		loginName: '',
		password: ''
	})
	const {
		primaryColor
	} = usePrimaryColor()

	// 获取默认organCode
	getDefaultOrganCodeApi().then(res => {
		plus.storage.setItem('AD_organCode', res.organCode)
	})

	const userStore = useUserStore()
	const login = () => {
		const params = {
			loginName: formData.loginName,
			organCode: common.getOrganCode(),
			password: encrypt.pwdEncrypt(formData.password),
		}
		loginApi(params).then(res => {
			plus.nativeUI.toast(res.message)
			plus.storage.setItem('tt', res.token_type)
			plus.storage.setItem('token', res.access_token)
			getUserInfoApi().then(userInfo => {
				const storageList = ['44', '33', '11', '22']
				storageList.forEach(item => {
					plus.storage.setItem('AD_' + item, userInfo[item])
				})
				plus.storage.setItem('userInfo', JSON.stringify(userInfo))
				userStore.$patch({
					userInfo: userInfo
				})

				uni.navigateTo({
					url: '/pages/login/chooseWard'
				})
			})
		})
	}

	const passwordRef = ref()
	const confirmLoginName = () => {
		passwordRef.value.onFocus()
	}

	const confirmPassword = () => {
		login()
	}
</script>

<style scoped lang="scss">
	.page-wrapper {
		background-color: #EBEBEC;
		padding-top: var(--status-bar-height);
		height: 100%;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.page-body {
		background-color: #fff;
		position: relative;
		width: 582.32rpx;
		height: 302.97rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 76.25rpx;
		border-radius: 39.81rpx;
		box-shadow: 0px 50px 82px 1px rgba(75, 90, 108, 0.27);
	}

	.login-bg {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}

	.company-logo {
		position: absolute;
		left: 18.89rpx;
		top: 5.89rpx;
	}

	.login-wrapper {
		width: 202.43rpx;

		.login-logo {
			display: flex;
			align-items: center;

			.login-text {
				font-size: 10.8rpx;
				color: #22939B;
				transform: translateY(1.27rpx);
				margin-left: 2.7rpx;
			}
		}

		.login-title {
			font-size: 16.87rpx;
			font-weight: bold;
			margin-top: 8.1rpx;
		}
	}

	.login-form {
		margin-top: 21.59rpx;
		padding-left: 2.7rpx;

		.form-label {
			display: flex;
			align-items: center;
			margin-bottom: 2.7rpx;

			.form-circle {
				width: 3.37rpx;
				height: 3.37rpx;
				border-radius: 50%;
				background-color: #333333;
			}

			.form-name {
				font-size: 8.77rpx;
				margin-left: 5.4rpx;
			}

			.form-english-name {
				font-size: 6.07rpx;
				margin-left: 8.1rpx;
			}
		}
	}

	.login-button {
		background-color: var(--primary-color);
		border-radius: 14.17rpx;
		width: 132.25rpx;
	}
</style>
