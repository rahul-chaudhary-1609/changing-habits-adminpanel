import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listBlog = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listBlog,
                getHeader(config)
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
            
        }
        
    })
}

export const deleteBlog = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.delete(
                `${apiConstant.deleteBlog}/${req.pathParams.id}`,
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response?.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}

export const getBlog = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                `${apiConstant.getBlog}/${req.pathParams.id}`,
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}

export const editBlog = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.editBlog}/${req.pathParams.id}`,
                JSON.stringify(req.data),
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}

export const addBlog = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req)
            let response = await api.post(
                `${apiConstant.addBlog}`,
                JSON.stringify(req.data),
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}

export const listBlogContentType = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                apiConstant.listBlogContentType,
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
            
        }
        
    })
}

export const addBlogContentType = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req)
            let response = await api.post(
                `${apiConstant.addBlogContentType}`,
                JSON.stringify(req.data),
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}