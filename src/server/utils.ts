import _jwt from "jsonwebtoken";
import { AUTH_CONFIG } from "./config";
import { TO } from "./type";
import SHA1 from 'crypto-js/sha1'
const sha1 = (str: string) => SHA1(str).toString()

export const Hash = {
    make: (str: string) => sha1(str),
    compare: (str: string, hash_str: string) => sha1(str) === hash_str,
}

export const throwErr = (condition: any, message: string) => {
    if (condition) throw new Error(message)
}


export const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return {
        year,
        month,
        day,
        hours,
        minutes,
        seconds,
        date: `${day}-${month}-${year}`,
        time: `${hours}:${minutes}:${seconds}`
    }
};


export const parseUserAgent = (ua: string) => {
    let browser, os, device;

    if (ua.includes("Chrome")) {
        browser = "Chrome";
    } else if (ua.includes("Firefox")) {
        browser = "Firefox";
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
        browser = "Safari";
    } else if (ua.includes("MSIE") || ua.includes("Trident")) {
        browser = "Internet Explorer";
    } else {
        browser = "Unknown";
    }

    if (ua.includes("Windows NT 10.0")) {
        os = "Windows 10";
    } else if (ua.includes("Windows NT 6.3")) {
        os = "Windows 8.1";
    } else if (ua.includes("Windows NT 6.2")) {
        os = "Windows 8";
    } else if (ua.includes("Mac OS X")) {
        os = "Mac OS X";
    } else if (ua.includes("Android")) {
        os = "Android";
    } else if (ua.includes("iPhone")) {
        os = "iOS (iPhone)";
    } else if (ua.includes("iPad")) {
        os = "iOS (iPad)";
    } else {
        os = "Unknown";
    }

    if (ua.includes("Mobi")) {
        device = "Mobile";
    } else if (ua.includes("Tablet")) {
        device = "Tablet";
    } else {
        device = "Desktop";
    }

    return { browser, os, device }
}



export const decodeJwt = (token: string) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}


export const jwt = {
    sign: (payload: TO, expiresIn?: number) => {
        const {
            secret,
            jwtConfig
        } = AUTH_CONFIG
        let _1hr = 1000 * 60 * 60
        let expires = expiresIn || jwtConfig?.expiresIn || _1hr

        return _jwt.sign(payload, secret, { ...jwtConfig, expiresIn: expires })
    },
    verify: (token: string, getPayload?: boolean) => {
        try {
            return _jwt.verify(token, AUTH_CONFIG.secret) as TO
        } catch (error) {
            throw new Error("Token expired");
        }
    }
}


export const generateSigninToken = (email: string) => {
    const {
        jwtConfig,
        actions,
    } = AUTH_CONFIG

    if (!actions?.signin) throw new Error("Invalid request")
    let { expiresIn } = actions.signin;
    const date = new Date();
    let _1hr = 1000 * 60 * 60
    let expires = expiresIn || jwtConfig?.expiresIn || _1hr

    return jwt.sign({
        email,
        refreshIn: date.getTime() + expires + _1hr
    }, expires)
}