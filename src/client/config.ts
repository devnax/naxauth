import { AUTH_CONFIG_TYPE } from "./type";

export let AUTH_CONFIG: AUTH_CONFIG_TYPE & {
    tokenName: string;
}

const NaxAuthConfig = (configs: AUTH_CONFIG_TYPE) => {

    AUTH_CONFIG = {
        tokenName: "authorization",
        ...configs
    }
}

export default NaxAuthConfig