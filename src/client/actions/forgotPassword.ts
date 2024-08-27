import Event from "../utils/Event";
import request from "../utils/request";

const forgotPassword = async (email: string) => {
    Event.emit("requestStart", "forgotPassword")
    const { info } = await request("forgotPassword", { email })
    if (info.data) {
        Event.emit("forgotPassword", info.data)
    }
    Event.emit("requestEnd", "forgotPassword", info)
    return info
}

export default forgotPassword