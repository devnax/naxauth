
export type EventNames =
    "getAuth" |
    "signin" |
    "signup" |
    "signout" |
    "verify" |
    "forgotPassword" |
    "resetPassword" |
    "signout" |
    "success" |
    "error" |
    "requestStart" |
    "requestEnd"

const events: { [name in EventNames]: Function[] } = {} as any

const Event = {
    on(name: EventNames, callback: Function) {
        if (!events[name]) events[name] = []
        events[name].push(callback);
    },
    emit(name: EventNames, ...args: any[]) {
        if (events[name]) {
            events[name].forEach(callback => callback.apply(null, args));
        }
    },
    off(name: EventNames, callback: Function) {
        if (events[name]) {
            events[name] = events[name].filter(cb => cb != callback);
        }
    }
}

export default Event