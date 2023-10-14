import {
	ref
} from "vue";
export const usePrimaryColor = () => {
	const primaryColor = ref('#0F9096')
	return {
		primaryColor
	}
}