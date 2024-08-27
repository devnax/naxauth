import Event from "../utils/Event";
import request from "../utils/request";

type ResetPasswordData = {
    password: string;
    token: string;
}

const resetPassword = async (data: ResetPasswordData) => {
    Event.emit("requestStart", "resetPassword")
    const { info } = await request("resetPassword", data)
    if (info.data) {
        Event.emit("resetPassword", info.data)
    }
    Event.emit("requestEnd", "resetPassword")
    return info
}

export default resetPassword