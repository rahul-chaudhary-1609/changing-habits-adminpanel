import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listFoodLogCategory = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listFoodLogCategory,
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

export const listPhases = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                apiConstant.listPhases,
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

export const toggleFoodLogCategoryStatus = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.toggleFoodLogCategoryStatus}/${req.pathParams.id}`,
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

export const getFoodLogCategory = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                `${apiConstant.getFoodLogCategory}/${req.pathParams.id}`,
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

export const editFoodLogCategory = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.editFoodLogCategory}/${req.pathParams.id}`,
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

export const addFoodLogCategory = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.post(
                `${apiConstant.addFoodLogCategory}`,
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