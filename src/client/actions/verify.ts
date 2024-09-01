import Event from "../utils/Event";
import request from "../utils/request";

const verify = async (token: string) => {
    Event.emit("requestStart", "verify")
    const { info } = await request("verify", { token })
    if (info.data) {
        Event.emit("verify", info.data)
    }
    Event.emit("requestEnd", "verify", info)
    return info
}

export default verify