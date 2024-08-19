"use client";
import * as React from 'react';
import Auth from 'naxauth/client';
import AuthProvider from 'naxauth/react/AuthProvider';
import { useAuth } from 'naxauth/react';
const { NaxAuthConfig, signin, getAuth, signout, signup, forgotPassword, resetPassword } = Auth;
NaxAuthConfig({
    baseUrl: "http://localhost:3001/api/auth",
    // tokenPlacement: "header",
    fetch: {
        method: "POST"
    },
    actions: {
        getAuth: {},
        signin: {},
        signup: {},
        forgotPassword: {},
        resetPassword: {}
    }
});
const AuthView = () => {
    const auth = useAuth();
    if (auth.loading) {
        return (React.createElement("div", null, "loading..."));
    }
    return (React.createElement("div", null,
        React.createElement("p", null, auth.data?.name),
        React.createElement("p", null, auth.data?.email)));
};
export default function Home() {
    return (React.createElement(AuthProvider, null,
        React.createElement("div", null,
            React.createElement(AuthView, null),
            React.createElement("button", { onClick: () => {
                    signup({
                        email: "najrul787@gmail.com",
                        password: "asdasd",
                        firstname: "Naxrul",
                        lastname: "Ahmed",
                        role: "admin",
                        status: "pandin"
                    });
                } }, "Signup"),
            React.createElement("button", { onClick: () => {
                    signin({
                        email: "najrul787@gmail.com",
                        password: "asdasd"
                    });
                } }, "Signin"),
            React.createElement("button", { onClick: async () => {
                    signout();
                } }, "Signout"),
            React.createElement("button", { onClick: async () => {
                    const auth = await getAuth();
                } }, "Get Auth"),
            React.createElement("button", { onClick: () => {
                    forgotPassword("najrul787@gmail.com");
                } }, "Forgot Password"),
            React.createElement("button", { onClick: () => {
                    resetPassword({
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hanJ1bDc4N0BnbWFpbC5jb20iLCJpYXQiOjE3MjM5NzY4NjQsImV4cCI6MTcyMzk4MDQ2NH0.H24JgDJ-BAuAbuPmihVvl3vsopjTP5JpURUO6ckCPoU",
                        password: "123123"
                    });
                } }, "Reset Password"))));
}
//# sourceMappingURL=page.js.map