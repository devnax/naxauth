import forgotPassword from "./actions/forgotPassword";
import getAuth from "./actions/getAuth";
import resetPassword from "./actions/resetPassword";
import signin from "./actions/signin";
import signup from "./actions/signup";
import update from "./actions/update";
import verify from "./actions/verify";

export type AuthHanderType = "getAuth" | "signin" | "signup" | "update" | "verify" | "forgotPassword" | "resetPassword"

const AuthHandler = async (type: AuthHanderType, req: any) => {
    switch (type) {
        case "getAuth":
            return await getAuth(req)
        case "signin":
            return await signin(req)
        case "signup":
            return await signup(req)
        case "update":
            return await update(req)
        case "verify":
            return await verify(req)
        case "forgotPassword":
            return await forgotPassword(req)
        case "resetPassword":
            return await resetPassword(req)
        default:
            throw new Error("Invalid Request");

    }
}

export default AuthHandler