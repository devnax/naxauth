import getAuth from "../actions/getAuth";

const useAuth = async (req: any) => {
    const auth = await getAuth(req)
    return auth.data
}

export default useAuth