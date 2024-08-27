import Event from "../utils/Event";
import { TO } from "../type";
import request from "../utils/request";

export type SignupData = {
    email: string;
    password: string;
} & TO

const signup = async (data: SignupData) => {
    Event.emit("requestStart", "signup")
    const { info } = await request("signup", data)
    if (info.data) {
        Event.emit("signup", info.data)
    }
    Event.emit("requestEnd", "signup")
    return info
}

export default signup