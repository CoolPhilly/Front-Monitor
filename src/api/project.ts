import request from './request/index'
import qs from 'qs';

// 创建项目
export function getProjectList() {
    return request({
        url: '/my/project',
        method: 'get',
    })
}

// 创建项目
export function createProject(param) {
    return request({
        url: '/my/project',
        method: 'post',
        data: qs.stringify(param),
    })
}

// 删除项目
export function deleteProject(param) {
    return request({
        url: '/my/project',
        method: 'delete',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(param), 
    })
}
