<template>
	<view class="page-wrapper">
		<view class="page-header">
			<view class="header-left">
				<view class="title">常用科室：</view>
				<view class="text-wrapper">
					<view class="text-item" v-for="item in commonWardList" @click="chooseWard(item)">
						{{item.wardName}}
					</view>

				</view>
			</view>
			<view class="header-right">
				<uni-easyinput prefixIcon="search" v-model="searchValue" placeholder="请输入科室名称"
					:primary-color="primaryColor" class="search-input" />
			</view>
		</view>
		<view class="page-body">
			<view class="ward-row" v-for="(val, key) in wardObjComputed">
				<view class="letter">
					{{key}}
				</view>
				<view class="row-right">
					<view class="ward-item" v-for="item in val" @click="chooseWard(item)">
						{{item.wardName}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		computed,
		reactive,
		ref
	} from "vue";
	import {
		usePrimaryColor
	} from '../../hooks/usePrimaryColor';
	import {
		useUserStore
	} from "../../stores/user";
	import {
		getCommonWardApi,
		getWardListApi
	} from "./api";
	const {
		primaryColor
	} = usePrimaryColor()


	const wardObj = ref({})
	const searchValue = ref('')
	const wardObjComputed = computed(() => {
		const obj = {}
		for (let key in wardObj.value) {
			const wardList = wardObj.value[key].filter(item => item.wardName.indexOf(searchValue.value) !== -1)
			if (wardList.length > 0) {
				obj[key] = wardList
			}
		}
		return obj
	})
	getWardListApi().then(res => {
		wardObj.value = res
	})

	const userStore = useUserStore()
	const chooseWard = (row) => {
		plus.storage.setItem('demo', JSON.stringify(row))
		userStore.$patch({
			currentWard: row
		})
		uni.reLaunch({
			url: '/pages/index/index'
		})
	}

	const commonWardList = ref([])
	const getCommonWard = () => {
		getCommonWardApi().then(res => {
			const wardList = res.map(item => item.wardList[0])
			commonWardList.value = wardList
		})
	}
	getCommonWard()

</script>
<style lang="scss" scoped>
	.page-wrapper {
		background-color: #fff;
		height: 100%;
		box-sizing: border-box;
		padding: 13.5rpx 6.75rpx;
		display: flex;
		flex-direction: column;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 7.42rpx;
		border-bottom: 1px dashed #E3E3E3;
	}

	.header-left {
		display: flex;
		align-items: center;

		.title {
			font-size: 16px;
			font-weight: bold;
		}

		.text-wrapper {
			display: flex;
			align-items: center;

			.text-item {
				color: var(--primary-color);
				font-size: 14px;
				margin-right: 13.49rpx;
			}
		}
	}

	.header-right {
		.search-input {
			:deep(.is-input-border) {
				border-radius: 13.49rpx;
			}
		}
	}

	.page-body {
		font-size: 14px;
		flex: 1;
		overflow: auto;
	}

	.ward-row {
		display: flex;
		align-items: center;
		padding: 9.44rpx 8.09rpx 5.4rpx;
		border-bottom: 1px dashed #E3E3E3;

		.letter {
			width: 10.79rpx;
			font-size: 10.79rpx;
			margin-right: 17.54rpx;
			margin-bottom: 5.4rpx;
		}

		.row-right {
			display: flex;
			flex-wrap: wrap;
		}

		.ward-item {
			width: 90.38rpx;
			margin-bottom: 5.4rpx;
		}
	}
</style>
