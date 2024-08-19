import Event from "../utils/Event";
import request from "../utils/request";

const forgotPassword = async (email: string) => {
    Event.emit("requestStart", "forgotPassword")
    const { info } = await request("forgotPassword", { email })
    let data: any;
    if (info.data) {
        Event.emit("forgotPassword", info.data)
        data = info.data
    }
    Event.emit("requestEnd", "forgotPassword", info)
    return data
}

export default forgotPassword