import { AUTH_CONFIG } from "../config";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";
import { TO } from "../type";
import { jwt } from "../utils";

const verify = async (req: any) => {
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
        if (!actions?.verify) throw new Error("Invalid request");
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }
        if (!requestData.body.token) throw new Error("Token required in getRequestData body");

        const { emailNotification, updateUser, messages, mail } = actions.verify

        let payload: TO = jwt.verify(requestData.body.token);

        const user = await getUserData(payload.email)
        if (!user) throw new Error(messages ? messages["invalid"] : "Invalid token")

        await updateUser({ user, requestData })
        info.message = messages ? messages["success"] : "successfully verify"

        if (transporter && emailNotification) {
            let defaultData: EmailTemplateData = {
                ...mailConfig?.defaultTemplateData,
                title: "Dear " + user.name,
                description: `
                <p>We’re happy to inform you that your email address has been successfully verified. Your account with ${brandName} is now fully activated!</p>
                <p style="margin-top: 20px">You can now log in and enjoy all the features</p>
                `,
                footer: `
                <p>If you have any questions or need assistance, don’t hesitate to contact us.</p>
                <p style="margin-top: 20px">Thank you for joining ${brandName}</p>
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

export default verify