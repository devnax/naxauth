import Event from "../utils/Event";
import Token from "../utils/Token";

const signout = async () => {
    Event.emit("requestStart", "signout")
    Token.delete()
    Event.emit("signout")
    Event.emit("requestEnd", "signout")
}

export default signout