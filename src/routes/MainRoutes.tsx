import { useAuth } from "../context/AuthContext"
import { ListScreen } from "../screens/ListScreen"
import LoginScreen from "../screens/Login"

const MainRoutes = () => {
    const { isLoggedIn } = useAuth()
    return !isLoggedIn ? <ListScreen/> : <LoginScreen/>
}

export default MainRoutes