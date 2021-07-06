import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listLearningContent = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listLearningContent,
                getHeader(config)
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            console.log(error.response)
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
            
        }
        
    })
}

export const toggleLearningContentStatus = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.toggleLearningContentStatus}/${req.pathParams.id}`,
                JSON.stringify(req.data),
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            console.log(error.response)
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}

export const listLearningQuiz = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listLearningQuiz,
                getHeader(config)
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            console.log(error.response)
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
            
        }
        
    })
}

export const toggleLearningQuizStatus = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.toggleLearningQuizStatus}/${req.pathParams.id}`,
                JSON.stringify(req.data),
                getHeader()
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            console.log(error.response)
            if ([401, 403].includes(error.response.status)) {
                apiError(error)
            } else {
                reject(error.response.data)
            }
        }
        
    })

}