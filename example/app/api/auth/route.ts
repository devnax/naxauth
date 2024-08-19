import { NextRequest, NextResponse } from "next/server";
import { AuthHandler } from "naxauth/server";
import "./config"

export const POST = async (req: NextRequest) => {
    try {
        const type = req.headers.get("request-type") as any
        const { status, message, data } = await AuthHandler(type, req)
        return NextResponse.json({ message, data }, { status })
    } catch (error) {
        return NextResponse.json({ message: "invalid reqest" }, { status: 404 })
    }
}