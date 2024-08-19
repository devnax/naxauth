import { AUTH_CONFIG } from "../config";
import { Hash, jwt } from "../utils";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";
import { TO } from "../type";

const resetPassword = async (req: any) => {
    const {
        brandName,
        getRequestData,
        getUserData,
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
        if (!actions?.resetPassword) throw new Error("Invalid request");
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }
        if (!requestData.body.token) throw new Error("Token not found in body")
        if (!requestData.body.password) throw new Error("Password required in request data body")

        const { emailNotification, updateUser, messages, mail } = actions.resetPassword

        let payload: TO = jwt.verify(requestData.body.token)

        const user: any = await getUserData(payload.email)
        if (!user) {
            throw new Error(messages ? messages["invalid"] : "Invalid token");
        }

        await updateUser({ requestData, user, hashPassword: Hash.make(requestData.body.password) })
        info.message = messages ? messages["success"] : "successfully reset"

        if (transporter && emailNotification) {
            let defaultData: EmailTemplateData = {
                ...mailConfig?.defaultTemplateData,
                title: "Dear " + user.name,
                description: `
                <p>Your password has been successfully reset. You can now log in to your account using your new password.</p>
                <p style="margin-top: 20px">If you did not request this change, please contact our support team immediately to ensure your account is secure.</p>
                `,
                footer: `
                <p>Thank you for using ${brandName}</p>
                <p style="margin-top: 40px">Best regards,</p>
                <p>${brandName} Team</p>
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
                subject: `Password Reset Successful - ${brandName}`,
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

export default resetPassword