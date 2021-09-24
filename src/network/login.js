import { request } from './request'
export function getLogin(loginForm) {
    return request({
        method: 'post',
        data: {
            loginForm
        }
    })
}