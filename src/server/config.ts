import { NaxAuthConfigProps, RequestData, TO, UserData } from "./type";
import nodemailer from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport";

type AUTH_CONFIG_TYPE = NaxAuthConfigProps<UserData<TO>, RequestData<TO>> & {
    transporter?: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
    secret: string;
    emailField: string;
    passwordField: string;
};

export let AUTH_CONFIG: AUTH_CONFIG_TYPE;

const AuthConfig = <U, Req>(configs: NaxAuthConfigProps<U, Req>) => {
    AUTH_CONFIG = {
        secret: Math.random().toString(32),
        emailField: "email",
        passwordField: "password",
        ...configs
    } as any
    if (configs.mailConfig) {
        const { defaultOptions, defaultTemplateData, ...mail } = configs.mailConfig || {}
        AUTH_CONFIG.transporter = nodemailer.createTransport(mail)
    }
}

export default AuthConfig