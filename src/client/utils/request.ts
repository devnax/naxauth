import { AUTH_CONFIG } from "../config";
import Event from "./Event";
import Token from "./Token";

const request = async (type: "getAuth" | "signin" | "signup" | "verify" | "forgotPassword" | "resetPassword", data?: Object) => {
    const { fetch: goobalFetch, baseUrl, actions, tokenName, tokenPlacement } = AUTH_CONFIG
    let { path, fetch: _fetch, onRequestStart, onRequestEnd, onError, onSuccess } = (actions || {} as any)[type]

    let opt: any = {
        credentials: 'include',
        ...goobalFetch,
        ..._fetch,
        headers: {
            ...goobalFetch?.headers,
            ...(_fetch?.headers || {}),
            "request-type": type
        },
    }

    if (tokenPlacement === 'header') opt.headers[tokenName] = Token.get()
    if (data) opt.body = JSON.stringify(data)

    onRequestStart && onRequestStart()

    const res = await fetch(`${baseUrl}${path || ""}`, opt)
    let info: { message: string, data: any } = await res.json();

    onRequestEnd && onRequestEnd(res)


    if (res.status === 200) {
        Event.emit("success", type, info)
        onSuccess && onSuccess(info.message)
    } else {
        onError && onError(info.message)
        Event.emit("error", type, info.message)
    }

    return {
        res,
        info
    }
}

export default request