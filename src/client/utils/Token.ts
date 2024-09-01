import { AUTH_CONFIG } from "../config";

const Token = {
    get() {
        const { tokenName, tokenPlacement } = AUTH_CONFIG
        if (tokenPlacement === "header") {
            return localStorage.getItem(tokenName)
        } else {
            let cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                let [key, value] = cookie.trim().split('=');
                if (key === tokenName) {
                    return value;
                }
            }
        }
        return null;
    },
    set(value: string) {
        const { tokenName, tokenPlacement } = AUTH_CONFIG
        if (tokenPlacement === 'header') {
            localStorage.setItem(tokenName, value)
        } else {
            const date = new Date();
            date.setTime(date.getTime() + (1000 * 60 * 60 * 24) * 1); // 1 days
            let expires = "; expires=" + date.toUTCString();
            document.cookie = tokenName + "=" + (value || "") + expires + ";SameSite=lax; path=/"
        }
    },
    delete() {
        const { tokenName, tokenPlacement } = AUTH_CONFIG
        if (tokenPlacement === 'header') {
            localStorage.removeItem(tokenName)
        } else {
            document.cookie = tokenName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
        }
    }
}


export default Token