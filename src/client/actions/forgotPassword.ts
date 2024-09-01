import Event from "../utils/Event";
import request from "../utils/request";

const forgotPassword = async (email: string) => {
    Event.emit("requestStart", "forgotPassword")
    const { info } = await request("forgotPassword", { email })
    if (info.status === 200) {
        Event.emit("forgotPassword", info)
    }
    Event.emit("requestEnd", "forgotPassword", info)
    return info
}

export default forgotPassword