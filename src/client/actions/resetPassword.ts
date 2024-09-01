import Event from "../utils/Event";
import request from "../utils/request";

type ResetPasswordData = {
    password: string;
    token: string;
}

const resetPassword = async (data: ResetPasswordData) => {
    Event.emit("requestStart", "resetPassword")
    const { info } = await request("resetPassword", data)
    if (info.status === 200) {
        Event.emit("resetPassword", info)
    }
    Event.emit("requestEnd", "resetPassword")
    return info
}

export default resetPassword