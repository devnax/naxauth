import AuthConfig from "./config";
import getAuth from "./actions/getAuth";
import signin from "./actions/signin";
import signout from "./actions/signout";
import signup from "./actions/signup";
import forgotPassword from "./actions/forgotPassword";
import resetPassword from "./actions/resetPassword";
import getAuthToken from "./actions/getAuthToken";
import Event from "./utils/Event";

const Auth = {
    AuthConfig,
    signin,
    getAuth,
    signout,
    signup,
    forgotPassword,
    resetPassword,
    getAuthToken,
    ...Event
}

export default Auth