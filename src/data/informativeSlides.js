import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listSlides = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listSlides,
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

export const deleteSlide = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.delete(
                `${apiConstant.deleteSlide}/${req.pathParams.id}`,
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

export const getSectionList = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.get(
                apiConstant.getSectionList,
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

export const changeSlideOrder = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await api.put(
                `${apiConstant.changeSlideOrder}`,
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