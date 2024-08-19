import Token from "../utils/Token";
import request from "../utils/request";
import Event from "../utils/Event";



const getAuth = async () => {
    Event.emit("requestStart", "getAuth")

    const { info } = await request("getAuth")
    let data: any;
    if (info.data) {
        if (info.data.refreshToken) {
            Token.set(info.data.refreshToken)
            delete info.data.refreshToken
        }
        Event.emit("getAuth", info.data)
        data = info.data
    }
    Event.emit("requestEnd", "getAuth", info)
    return data
}

export default getAuth