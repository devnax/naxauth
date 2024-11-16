import Event from "../utils/Event";
import { TO } from "../type";
import Token from "../utils/Token";
import request from "../utils/request";

export type SigninData = {
    email: string;
    password: string;
} & TO

const signin = async (data: SigninData) => {
    Event.emit("requestStart", "signin")
    const { info } = await request("signin", data)
    if (info.status === 200) {
        Token.set(info.data.token)
        Event.emit("signin", info)
    }
    Event.emit("requestEnd", "signin", info)
    return info
}

export default signin