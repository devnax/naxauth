import { AUTH_CONFIG } from "../config";
import { TO } from "../type";
import { decodeJwt, generateSigninToken, jwt } from "../utils";

const getAuth = async (req: any) => {
    const {
        getRequestData,
        getUserData,
        getAuthData
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
        } catch (error) {
            payload = decodeJwt(requestData.authToken)
            const date = new Date();
            if (payload.refreshIn && payload.refreshIn > date.getTime()) {
                refreshToken = generateSigninToken(payload.email)
            } else {
                throw new Error("Token expired");
            }
        }

        const user: any = await getUserData(payload.email)
        if (!user) throw new Error("Invalid token");

        const authData = getAuthData ? await getAuthData({ user, requestData }) : {
            name: user.name,
            email: user.email,
            photo: user.photo
        }

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