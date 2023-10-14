import { common } from "@/utils/common"

// 获取默认organCode
export const getDefaultOrganCodeApi = () => {
	return common.axios({
		url: 'demo1',
		method: 'get'
	})
}

