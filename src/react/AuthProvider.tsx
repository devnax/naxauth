import React, { createContext, useEffect, useState } from "react";
import Auth from "../client";

export type AuthData = {
    name: string;
    email: string;
    photo?: string;
}

export type AuthContextType = {
    data: null | AuthData,
    loading: boolean,
}

export const AuthContext = createContext<AuthContextType>({
    data: null,
    loading: false
})
AuthContext.displayName = "AuthContext"

const AuthProvider = ({ children }: { children: any }) => {
    const [auth, setAuth] = useState({
        data: null,
        loading: false
    })

    const requestStart = (type: string) => {
        if (type === 'getAuth' && Auth.getAuthToken()) {
            setAuth({
                data: null,
                loading: true
            })
        }
    }

    const requestEnd = (type: string, info: any) => {
        if (type === 'getAuth' || type === 'signout') {
            setAuth({
                data: info?.data,
                loading: false
            })
        } else if (type === 'signin' && info.data) {
            Auth.getAuth()
        }
    }

    useEffect(() => {
        Auth.on("requestStart", requestStart)
        Auth.on("requestEnd", requestEnd)
        Auth.getAuth()

        return () => {
            Auth.off("requestStart", requestStart)
            Auth.off("requestEnd", requestEnd)
        }
    }, [])

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider