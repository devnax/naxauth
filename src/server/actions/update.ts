import { AUTH_CONFIG } from "../config";
import { Hash, jwt } from "../utils";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";

const update = async (req: any) => {
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
        if (!actions?.update) throw new Error("Invalid request");
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }

        if (!requestData.body.email) throw new Error("Email require in getRequestData body");
        let exists = await getUserData(requestData.body.email)

        let {
            emailNotification,
            messages,
            updateUser,
            mail
        } = actions.update

        if (!exists) throw new Error(messages ? messages["notFound"] : "User not found");

        let user = await updateUser({
            user: exists,
            requestData,
            hashPassword: requestData.body.password ? Hash.make(requestData.body.password) : null
        })

        info.message = messages ? messages["success"] : "Successfully user updated"

        info.data = {
            name: user.name,
            email: user.email,
            photo: user.photo
        }

        if (transporter && emailNotification) {
            let description, footer, _action, subject, title = "Dear " + user.name;
            subject = `Your Account Information Has Been Updated`
            description = `
                <p style="margin-bottom: 20px">We wanted to let you know that your account information has been successfully updated.</p>
                <p style="margin-bottom: 20px">If you did not make these changes or believe an unauthorized person has accessed your account, please contact our support team immediately.</p>
                <p style="margin-bottom: 20px">If everything looks good, no further action is needed on your part.</p>
                <p>Thank you for keeping your account up to date!</p>
                `
            footer = `
                <p>Best regards,</p>
                <p>${brandName} Team</p>
                `

            let defaultData: EmailTemplateData = {
                ...mailConfig?.defaultTemplateData,
                title,
                description,
                footer,
                action: _action
            }
            let _mail = mail ? await mail({ user: user, requestData, templateData: defaultData }) : {
                options: {} as any,
                data: defaultData
            }
            if (!_mail.options.html) {
                _mail.options.html = emailTempalte(_mail.data || defaultData)
            }

            await transporter.sendMail({
                ...mailConfig?.defaultOptions,
                to: user.email,
                subject,
                ..._mail.options
            })
        }
    } catch (error: any) {
        info.status = 400
        info.message = error.message
    }
    return info
}

export default update