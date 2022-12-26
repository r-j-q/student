import {
	post,
	get,
	put,
	del
} from '@/utils/request'
// /statistics/getSelectRegion

// 登录接口
export function authLogin(query) {
	return post('/user/login/', query);
}

//注册接口
export function authRegister(query) {
	return post('/user/register/', query);
}

//获取csrf_token
export function getcsrfToken() {
	return get('/user/getCSRFToken/');
}

//更新用户数据
export function updateUserInfoMessage(query) {
	return put('/user/updateUserInfo/', query);
}

//提交生源
export function getSchoolRecommendFn(query) {
	return post('/schoolSelect/main/getSchoolRecommend', query);
}

