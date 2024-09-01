import { SignOptions } from "jsonwebtoken";
import { MailOptions } from "nodemailer/lib/json-transport";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailTemplateData } from "./emailTemplate";

export type TO = { [key: string]: any }
export type UserData<User> = Omit<User, "name" | "email" | "password" | "photo"> & {
    name: string;
    email: string;
    password: string;
    photo?: string;
}
export type RequestData<User> = {
    authToken: string;
    userAgent: string;
    body: Partial<Omit<User, "email" | "password" | "token">> & {
        email?: string;
        password?: string;
        token?: string;
    };
}

type UserAndReqData<User> = { user: User, requestData: RequestData<User> }

export interface NaxAuthConfigProps<User, Req> {
    brandName: string;
    secret?: string;
    jwtConfig?: SignOptions & {
        expiresIn?: number
    };
    mailConfig?: {
        defaultOptions?: MailOptions,
        defaultTemplateData?: EmailTemplateData
    } & SMTPTransport.Options;

    getRequestData: (req: Req) => Promise<RequestData<User>>;
    getUserData: (email: string) => Promise<UserData<User>>;
    getAuthData?: (ctx: UserAndReqData<User>) => Promise<Partial<UserData<User>>>;

    actions?: {
        signin?: {
            emailNotification?: boolean;
            expiresIn?: number;
            messages?: { [type in "wrongEmail" | "wrongPassword" | "success"]: string };
            checkUser?: (ctx: UserAndReqData<User>) => Promise<void>;
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        },
        signup?: {
            mailType?: "verificaion" | "normal",
            expiresLinkIn?: number;
            messages?: { [type in "exists" | "invalidPassword" | "success"]: string };
            action?: {
                url: string;
                text?: string;
            };
            isVerified?: (ctx: UserAndReqData<User>) => Promise<boolean>;
            createUser: (ctx: { requestData: RequestData<User>, hashPassword: string }) => Promise<UserData<User>>;
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        },
        update?: {
            emailNotification?: boolean,
            messages?: { [type in "notFound" | "success"]: string };
            updateUser: (ctx: UserAndReqData<User> & { hashPassword: string | null }) => Promise<UserData<User>>;
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        },
        verify?: {
            emailNotification?: boolean;
            messages?: { [type in "exists" | "invalid" | "success"]: string };
            updateUser: (ctx: { user: User, requestData: RequestData<User> }) => Promise<void>;
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        },
        forgotPassword?: {
            expiresLinkIn?: number;
            messages?: { [type in "sent" | "invalidUser" | "success"]: string };
            action: {
                url: string;
                text?: string;
            };
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        },
        resetPassword?: {
            emailNotification?: boolean;
            messages?: { [type in "expired" | "invalid" | "success"]: string };
            updateUser: (ctx: UserAndReqData<User> & { hashPassword: string }) => Promise<void>;
            mail?: (ctx: UserAndReqData<User> & { templateData: EmailTemplateData }) => Promise<{
                data?: Partial<EmailTemplateData>,
                options?: MailOptions;
            }>
        }
    }
}