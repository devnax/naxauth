
## Server callbacks

```js

import {
    NaxAuthConfig,
    getAuth,
    signin,
    signup,
    verify,
    forgotPassword,
    resetPassword,
    useAuth,
    AuthHandler
} from 'naxauth/server'

NaxAuthConfig({
    secret: process.env.APP_SECRET,
    brandName: "Your Brand Name",
    mailConfig: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: '',
            pass: ''
        },
        defaultTemplateData: {
            logo: "url"
        }
    },
    async getRequestData(req) {
        return {
            authToken: req.cookies['authorization'],
            userAgent: "",
            body: req.body
        }
    },
    async getUserData(email) {
        return await User.find({email})
    },
    actions: {
        signin: {
            emailNotification: false,
        },
        signup: {
            action: {
                url: "http://localhost:3000",
            },
            async createUser({
                requestData,
                hashPassword
            }) {
                const body = requestData.body
                const created = await User.create({
                    ...body,
                    email: body.email,
                    password: hashPassword,
                    "firstname": body.firstname,
                    "status": "active",
                    "role": "admin"
                })
                return {
                    ...created,
                    name: `${created.firstname} ${created.lastname}`,
                    email: created.email,
                    photo: created.photo
                }
            }
        },
        verify: {
            async updateUser({
                user,
                requestData
            }) {
                await User.update({status: "active"}, {email: user.email})
            },
        },
        forgotPassword: {
            action: {
                url: "http://localhost:3000"
            }
        },
        resetPassword: {
            async updateUser({
                user,
                hashPassword
            }) {
                await User.update({password: hashPassword}, {email: user.email})
            },
        }
    }
})

app.post("/auth", async (req, res)=> {
    const {data, message, status} = await getAuth(req)
    const {data, message, status} = await signin(req)
    const {data, message, status} = await signup(req)
    const {data, message, status} = await verify(req)
    const {data, message, status} = await forgotPassword(req)
    const {data, message, status} = await resetPassword(req)
    const {data, message, status} = await useAuth(req)

    const type = req.headers['request-type']
    const {data, message, status} = await  AuthHandler(type, req)

    res.status(status).json({data, message})
})

```



## Server configs reference

```js
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
            createUser: (ctx: { requestData: RequestData<User>, hashPassword: string }) => Promise<UserData<User>>;
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

```



## Client Config
```js
import Auth from 'naxauth/client'

Auth.NaxAuthConfig({
 baseUrl: "http://localhost:3000/api/auth",
  fetch: {
    method: "POST"
  },
  actions: {
    getAuth: {
        path: "/"
    },
    signin: {
        path: "/signin"
    },
    signup: {
    },
    forgotPassword: {
    },
    resetPassword: {
    }
  }
})

```

## Client callbacks

```js
import Auth from 'naxauth/client'

await Auth.signin({
    email: "",
    password: ""
})

const auth = await Auth.getAuth()

await Auth.signout()

await Auth.signup({})

await Auth.forgotPassword(email)
await Auth.resetPassword({token: "", password: ""})

const isLogin = await Auth.getAuthToken()


```


## Client configs reference

```js

export type TO = { [key: string]: any }

export type ActionCallbacks = {
    onRequestStart?: () => string;
    onRequestEnd?: (res: Response) => string;
    onError?: (message: string) => void;
    onSuccess?: (message: string) => void;
}

export type ActionType = ActionCallbacks & {
    path?: string;
    fetch?: RequestInit;
}

export interface AUTH_CONFIG_TYPE {
    baseUrl: string;
    fetch?: RequestInit;
    tokenName?: string;
    tokenPlacement?: "cookie" | "header",

    actions?: {
        getAuth?: ActionType,
        signin?: ActionType,
        signup?: ActionType,
        verify?: ActionType,
        forgotPassword?: ActionType,
        resetPassword?: ActionType
    }
}

```


## Client Event
```ts
import Auth from 'naxauth/client'
export type EventNames =
    "getAuth" |
    "signin" |
    "signup" |
    "signout" |
    "verify" |
    "forgotPassword" |
    "resetPassword" |
    "signout" |
    "success" |
    "error" |
    "requestStart" |
    "requestEnd"

Auth.on(eventName, callback)
Auth.off(eventName, callback)
Auth.emit(eventName)

```



## React
```jsx
import {AuthProvider, useAuth} from 'naxauth/react'


const AuthView = () => {
    const auth = useAuth()

    if(auth.loading) return "loading..."
    return <div>
        {auth.name}
        {auth.email}
        {auth.photo}
    </div>
}

const App = () => {
    return (
        <AuthProvider>
            <AuthView />
        </AuthProvider>
    )
}

```