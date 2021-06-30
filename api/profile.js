import { request } from "@/plugins/request"

// 获取用户个人信息
export const getProfile = (username) => {
    return request({
        method: "GET",
        url: `/api/profiles/${username}`,
    })
}

// 关注用户
export const Follow = (username) => {
    return request({
        method: "POST",
        url: `/api/profiles/${username}/follow`,
    })
}

// 取消关注
export const Unfollow = (username) => {
    return request({
        method: "DELETE",
        url: `/api/profiles/${username}/follow`,
    })
}