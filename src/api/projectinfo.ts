import request from './request/index'
import qs from 'qs';

// 获取项目错误信息
export function getProjectErrorInfo(param) {
    return request({
        url: '/my/projecterrorinfo',
        method: 'post',
        data: qs.stringify(param),
    })
}

// 获取项目网络信息
export function getProjectNetworkInfo(param) {
    return request({
        url: '/my/projectperformanceinfo/network',
        method: 'post',
        data: qs.stringify(param),
    })
}

// 获取项目渲染信息
export function getProjectRenderInfo(param) {
    return request({
        url: '/my/projectperformanceinfo/render',
        method: 'post',
        data: qs.stringify(param),
    })
}

// 获取项目资源信息
export function getProjectResourceInfo(param) {
    return request({
        url: '/my/projectperformanceinfo/resource',
        method: 'post',
        data: qs.stringify(param),
    })
}

// 获取项目用户信息
export function getProjectUserInfo(param) {
    return request({
        url: '/my/projectuserinfo',
        method: 'post',
        data: qs.stringify(param),
    })
}
