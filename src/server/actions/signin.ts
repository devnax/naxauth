import { AUTH_CONFIG } from "../config";
import { generateSigninToken, Hash, jwt, parseUserAgent } from "../utils";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";

const signin = async (req: any) => {
    const {
        brandName,
        getRequestData,
        getUserData,
        mailConfig,
        actions,
        transporter
    } = AUTH_CONFIG

    const info = {
        status: 200,
        message: "",
        data: null as any
    }

    try {
        if (!actions?.signin) throw new Error("Invalid request")
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }
        if (!requestData.body.email) throw new Error("Email require in getRequestData body")
        if (!requestData.body.password) throw new Error("Password require in getRequestData body")

        const user = await getUserData(requestData.body.email)

        let { messages, checkUser, emailNotification, mail } = actions.signin;
        if (!user) throw new Error("User not found");
        if (!Hash.compare(requestData.body.password, user.password)) throw new Error("Wrong password");
        checkUser && await checkUser({ requestData, user })
        const date = new Date();
        info.data = {
            token: generateSigninToken(user.email)
        }
        info.message = messages ? messages['success'] : "Successfully logged in"

        const ua = requestData.userAgent ? parseUserAgent(requestData.userAgent) : null

        if (transporter && emailNotification) {
            let defaultData: EmailTemplateData = {
                ...mailConfig?.defaultTemplateData,
                title: "Dear " + user.name,
                description: `
                <p style="margin-bottom: 16px">
                    We noticed a successful login to your account on ${brandName} from the following device:
                </p>
                <p><b>Date and Time</b>: ${date.toString()}</p>
                ${ua ? `<p><b>Device</b>: ${ua.device} ${ua.os}, ${ua.browser}</p>` : ''}
                `,

                footer: `
                <p>If this was you, no further action is required. If you did not authorize this login, please reset your password immediately and contact our support team.</p>
                <p>Thank you for using ${brandName}.</p>
                <p><b>Best regards,</b></p>
                <p>${brandName} Support Team</p>
                `,
            }

            let _mail = mail ? await mail({ user, requestData, templateData: defaultData }) : {
                options: {} as any,
                data: defaultData
            }
            if (!_mail.options.html) {
                _mail.options.html = emailTempalte(_mail.data || defaultData)
            }
            await transporter.sendMail({
                ...mailConfig?.defaultOptions,
                subject: "Successful Login Notification",
                to: user.email,
                ..._mail.options,
            })
        }
    } catch (error: any) {
        info.status = 400
        info.message = error.message
    }
    return info
}

export default signin