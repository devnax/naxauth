import Event from "../utils/Event";
import request from "../utils/request";

type ResetPasswordData = {
    password: string;
    token: string;
}

const resetPassword = async (data: ResetPasswordData) => {
    Event.emit("requestStart", "resetPassword")
    const { info } = await request("resetPassword", data)
    let _data: any;
    if (info.data) {
        Event.emit("resetPassword", info.data)
        _data = info.data
    }
    Event.emit("requestEnd", "resetPassword")
    return _data
}

export default resetPassword