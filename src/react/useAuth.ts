import { useContext } from "react"
import { AuthContext } from "./AuthProvider"

const useAuth = () => {
    const data = useContext(AuthContext)
    return data
}

export default useAuth