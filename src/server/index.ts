import AuthConfig from "./config"
import signin from "./actions/signin"
import signup from "./actions/signup"
import verify from "./actions/verify"
import getAuth from "./actions/getAuth"
import forgotPassword from "./actions/forgotPassword"
import resetPassword from "./actions/resetPassword"
import useAuth from "./hooks/useAuth"
import AuthHandler from "./AuthHandler"

const Auth = {
    AuthConfig,
    getAuth,
    signin,
    signup,
    verify,
    forgotPassword,
    resetPassword,
    useAuth,
    AuthHandler
}

export default Auth