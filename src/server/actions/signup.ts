import { AUTH_CONFIG } from "../config";
import { Hash, jwt } from "../utils";
import emailTempalte, { EmailTemplateData } from "../emailTemplate";
import signin from "./signin";

const signup = async (req: any) => {
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
        if (!actions?.signup) throw new Error("Invalid request");
        const requestData = await getRequestData(req)
        if (requestData.authToken) {
            let has: any;
            try {
                has = jwt.verify(requestData.authToken)
            } catch (error) { }
            if (has) throw new Error("You are already logged in");
        }

        if (!requestData.body.email) throw new Error("Email require in getRequestData body");
        if (!requestData.body.password) throw new Error("password require in getRequestData body");

        let exists = await getUserData(requestData.body.email)

        let {
            expiresLinkIn,
            mailType,
            messages,
            action,
            createUser,
            mail
        } = actions.signup

        if (mailType === 'verificaion' && !action?.url) throw new Error("Verification action url required, please configure verification prop");

        if (exists) throw new Error(messages ? messages["exists"] : "User already exists");

        let user = await createUser({ requestData, hashPassword: Hash.make(requestData.body.password) })
        info.message = messages ? messages["success"] : "Successfully singup"

        info.data = {
            name: user.name,
            email: user.email,
            photo: user.photo
        }

        if (transporter && mailType) {
            let description, footer, _action, subject, title = "Dear " + user.name;

            if (mailType === 'verificaion' && action) {

                let token = jwt.sign({ email: user.email }, expiresLinkIn)

                subject = "Verify Your Email"
                description = `
                <p style="margin-bottom: 16px">
                Thank you for registering with ${brandName} To complete your registration, please verify your email address by clicking the link below:
                </p>
                `
                footer = `
                <p>If you did not create this account, please ignore this message.</p>
                <p>If you need assistance, feel free to contact our support team.</P>
                <p>Thank you for joining us, and we look forward to seeing you soon!</P>
                <p>Best regards,</P>
                <p>${brandName} Team</p>
                `
                _action = {
                    text: action.text || "Verify my email address",
                    link: `${action.url}?token=${token}`
                }
            } else if (mailType === 'normal') {
                subject = `Welcome to ${brandName} - Registration Successful!`
                description = `
                <p>Thank you for registering with ${brandName}. We're excited to have you on board. Your account has been successfully created, and you can now enjoy the full benefits of our platform.</p>
                <p style="margin: 20px 0">Here are your account details:</p>
                <p>Email: ${user.email}</p>
                `
                footer = `
                <p>To get started, simply log in to your account at ${brandName} and explore what we have to offer.</p>
                <p style="margin: 20px 0">If you have any questions or need assistance, feel free to reach out to our support team</p>
                <p style="margin-bottom: 20px">We’re thrilled to have you as part of our community!</p>
                <p>Best regards,</p>
                <p>${brandName} Team</p>
                `
            }

            let defaultData: EmailTemplateData = {
                ...mailConfig?.defaultTemplateData,
                title,
                description,
                footer,
                action: _action
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

export default signup