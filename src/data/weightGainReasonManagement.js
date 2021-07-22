import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listReason = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listReason,
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

export const deleteReason = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.delete(
                `${apiConstant.deleteReason}/${req.pathParams.id}`,
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

export const getReason = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                `${apiConstant.getReason}/${req.pathParams.id}`,
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

export const editReason = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.editReason}/${req.pathParams.id}`,
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

export const addReason = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req)
            let response = await api.post(
                `${apiConstant.addReason}`,
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