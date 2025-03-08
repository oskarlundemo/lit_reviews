







import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";

const ProtectedRoute = ({children}) => {
    const {user} = useAuth();
    if (!user || !user.admin) {
        return <Navigate to="/"/>;
    }
    return children;
}

export default ProtectedRoute;
