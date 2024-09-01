import Event from "../utils/Event";
import request from "../utils/request";

const verify = async (token: string) => {
    Event.emit("requestStart", "verify")
    const { info } = await request("verify", { token })
    if (info.status === 200) {
        Event.emit("verify", info)
    }
    Event.emit("requestEnd", "verify", info)
    return info
}

export default verify