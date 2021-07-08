import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const upload = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                header: {
                    contentType:"multipart/form-data"
                }
            }
            let response = await api.put(
                `${apiConstant.uploadImage}`,
                req.data,
                getHeader(config)
            )
            if (response.status == 200) {
                resolve(response.data)
            } else {
                reject(response.data)
            }
        } catch (error) {
            console.log(error.response)
            if (error.response && [401, 403].includes(error.response.status)) {
                apiError(error)
            } else if(error.response){
                reject(error.response?.data)
            }
            else {
                error.message = "Something went wrong..."
                error.status = "400"
                reject(error)
            }
        }
        
    })
}