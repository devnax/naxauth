import Event from "../utils/Event";
import { TO } from "../type";
import request from "../utils/request";

export type UpdateData = {
    email: string;
} & TO

const update = async (data: UpdateData) => {
    Event.emit("requestStart", "update")
    const { info } = await request("update", data)
    if (info.data) {
        Event.emit("update", info.data)
    }
    Event.emit("requestEnd", "update")
    return info
}

export default update