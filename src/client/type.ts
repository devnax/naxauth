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
        update?: ActionType,
        verify?: ActionType,
        forgotPassword?: ActionType,
        resetPassword?: ActionType
    }
}
