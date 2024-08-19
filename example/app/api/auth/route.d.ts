import { NextRequest, NextResponse } from "next/server";
import "./config";
export declare const POST: (req: NextRequest) => Promise<NextResponse<{
    message: string;
}>>;
