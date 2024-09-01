import Event from "../utils/Event";
import { TO } from "../type";
import request from "../utils/request";

export type UpdateData = {
    email: string;
} & TO

const update = async (data: UpdateData) => {
    Event.emit("requestStart", "update")
    const { info } = await request("update", data)
    if (info.status === 200) {
        Event.emit("update", info)
    }
    Event.emit("requestEnd", "update")
    return info
}

export default update