import { AUTH_CONFIG } from "../config";
import getAuth from "../actions/getAuth";

const useAuthUser = async (req: any) => {
    const auth = await getAuth(req)
    if (auth.data?.email) {
        return await AUTH_CONFIG.getUserData(auth.data.email)
    }
}

export default useAuthUser