import { PrismaClient } from "@prisma/client";
import { NaxAuthConfig } from "naxauth/server";
let DB = new PrismaClient();
NaxAuthConfig({
    secret: "APP_SECRET",
    brandName: "Nax Auth",
    mailConfig: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: '',
            pass: ''
        },
        defaultTemplateData: {
            logo: ""
        }
    },
    async getRequestData(req) {
        let body;
        try {
            body = await req.json();
        }
        catch (error) { }
        return {
            authToken: req.cookies.get("authorization")?.value,
            userAgent: "",
            body
        };
    },
    async getUserData(email) {
        const user = await DB.user.findFirst({
            where: {
                email
            }
        });
        if (user) {
            return {
                ...user,
                name: `${user.firstname} ${user.lastname || ""}`,
                email: user.email,
                password: user.password,
                photo: user.photo
            };
        }
    },
    actions: {
        signin: {
            emailNotification: false,
            // expiresIn: 5
        },
        signup: {
            action: {
                url: "http://localhost:3000",
            },
            async createUser({ requestData, hashPassword }) {
                const body = requestData.body;
                const created = await DB.user.create({
                    data: {
                        ...body,
                        email: body.email,
                        password: hashPassword,
                        "firstname": body.firstname,
                        "status": "active",
                        "role": "admin"
                    }
                });
                return {
                    ...created,
                    name: `${created.firstname} ${created.lastname}`,
                    email: created.email,
                    photo: created.photo
                };
            }
        },
        verify: {
            async updateUser({ user, requestData }) {
                await DB.user.update({
                    data: {
                        status: "active"
                    },
                    where: { email: user.email }
                });
            },
        },
        forgotPassword: {
            action: {
                url: "http://localhost:3000"
            }
        },
        resetPassword: {
            // emailNotification: true,
            async updateUser({ user, hashPassword }) {
                await DB.user.update({
                    data: { password: hashPassword },
                    where: {
                        email: user.email
                    }
                });
            },
        }
    }
});
//# sourceMappingURL=config.js.map