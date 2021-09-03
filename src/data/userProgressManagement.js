import { api,getHeader,apiError } from "../utils/helper";
import apiConstant from "../apiConstants";


export const listUser = (req = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            let config = {
                queryParams: req.queryParams
            }
            let response = await api.get(
                apiConstant.listUser,
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