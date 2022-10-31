import request from './request/index'
import qs from 'qs';

// 注册
export function register(param) {
    return request({
		url: '/api/register',
		method: 'post',
        data: qs.stringify(param),
	})
}

// 登录
export function login(param) {
    return request({
		url: '/api/login',
		method: 'post',
        data: qs.stringify(param),
	})
}

// 获取帐号
export function getAccounts() {
	return request({
		url: '/api/accounts',
		method: 'get',
	})
}

// 获取用户信息
export function getUserInfo() {
    return request({
		url: '/my/userinfo',
		method: 'get',
	})
}

// 更新用户信息
export function updateUserInfo(param) {
    return request({
		url: '/my/userinfo',
		method: 'post',
		data: qs.stringify(param),
	})
}

// 修改密码
export function updatePassword(param) {
    return request({
		url: '/my/updatepwd',
		method: 'post',
		data: qs.stringify(param),
	})
}