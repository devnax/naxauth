import Token from "../utils/Token";
import request from "../utils/request";
import Event from "../utils/Event";



const getAuth = async () => {
    Event.emit("requestStart", "getAuth")
    const { info } = await request("getAuth")
    if (info.data) {
        if (info.data.refreshToken) {
            Token.set(info.data.refreshToken)
            delete info.data.refreshToken
        }
        Event.emit("getAuth", info.data)
    }
    Event.emit("requestEnd", "getAuth", info)
    return info
}

export default getAuth