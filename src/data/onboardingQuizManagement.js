import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listOnboardingQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listOnboardingQuiz,
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

export const deleteOnboardingQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.delete(
                `${apiConstant.deleteOnboardingQuiz}/${req.pathParams.id}`,
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

export const getOnboardingQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                `${apiConstant.getOnboardingQuiz}/${req.pathParams.id}`,
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

export const editOnboardingQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.editOnboardingQuiz}/${req.pathParams.id}`,
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

export const addOnboardingQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(req)
            let response = await api.post(
                `${apiConstant.addOnboardingQuiz}`,
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