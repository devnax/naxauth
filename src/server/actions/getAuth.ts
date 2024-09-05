import { AUTH_CONFIG } from "../config";
import { generateSigninToken, jwt } from "../utils";

const getAuth = async (req: any) => {
    const {
        getRequestData,
        getUserData,
        getAuthData,
        actions
    } = AUTH_CONFIG

    const info = {
        status: 200,
        message: "",
        data: null as any
    }

    try {
        const requestData = await getRequestData(req)
        if (!requestData.authToken) throw new Error("please login first");

        let payload: any;
        let refreshToken: any;
        try {
            payload = jwt.verify(requestData.authToken);
        } catch (error: any) {
            payload = jwt.decode(requestData.authToken)
            const date = new Date();
            if (payload.refreshIn && parseInt(payload.refreshIn) > date.getTime()) {
                let _payload = {}
                if (actions?.signin?.getPayload) {
                    const user: any = await getUserData(payload.email)
                    if (!user) throw new Error("Invalid token");
                    _payload = await actions.signin.getPayload({ requestData, user })
                }
                refreshToken = generateSigninToken({
                    ..._payload,
                    email: payload.email
                })
            } else {
                throw new Error(error.message);
            }
        }

        const user: any = await getUserData(payload.email)
        if (!user) throw new Error("Invalid token");
        const defAuthData = {
            name: user.name,
            email: user.email,
            photo: user.photo
        }
        const authData = getAuthData ? { ...defAuthData, ...await getAuthData({ user, requestData }) } : defAuthData

        info.data = authData
        if (refreshToken) {
            info.data.refreshToken = refreshToken
        }
        info.message = "success"
    } catch (error: any) {
        info.status = 400
        info.message = error.message
    }
    return info
}

export default getAuth