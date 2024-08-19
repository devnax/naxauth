import { AUTH_CONFIG } from "../config";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";
import { jwt } from "../utils";

const forgotPassword = async (req: any) => {
    const {
        brandName,
        getRequestData,
        getUserData,
        jwtConfig,
        mailConfig,
        transporter,
        actions
    } = AUTH_CONFIG

    const info = {
        status: 200,
        message: "",
        data: null as any
    }

    try {
        if (!actions?.forgotPassword) throw new Error("Invalid request");
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }
        if (!requestData.body.email) throw new Error("Email required in getRequestData");

        const user: any = await getUserData(requestData.body.email)
        if (!user) throw new Error("User not found");
        const { expiresLinkIn, messages, action, mail } = actions.forgotPassword

        if (!transporter) throw new Error("invalid mail configuration");

        let token = jwt.sign({ email: user.email }, expiresLinkIn)

        let defaultData: EmailTemplateData = {
            ...mailConfig?.defaultTemplateData,
            title: "Dear " + user.name,
            description: `
                <p >
                We received a request to reset the password for your account on ${brandName}. If you made this request, please click the link below to reset your password:
                </p>
                `,
            footer: `
                <p style="margin-bottom: 16px">For security reasons, this link will expire in ${expiresLinkIn || jwtConfig?.expiresIn || "1hr"}. If you didn’t request a password reset, please ignore this email, and your account will remain secure.</p>
                <p style="margin-bottom: 16px">If you need further assistance, feel free to contact our support team.</p>
                <p>Thank you,</P>
                <p>${brandName} Team</p>
                `,
            action: {
                text: action.text || "Reset password",
                link: `${action.url}?token=${token}`
            }
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
            subject: `Password Reset Request for ${brandName}`,
            to: user.email,
            ..._mail.options,
        })

        info.message = messages ? messages["success"] : "Reset link sent"
    } catch (error: any) {
        info.status = 400
        info.message = error.message
    }
    return info
}

export default forgotPassword