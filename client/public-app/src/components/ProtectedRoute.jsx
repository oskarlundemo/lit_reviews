/**
 * This component is used in the App.jsx to protect routes from unauthorised users,
 * so only admins can access theese pages
 */




import {Navigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";

const ProtectedRoute = ({children}) => {
    const {user} = useAuth(); // Get the current user from AuthContext.jsx
    if (!user || !user.admin) { {/*If there is no user and the user is not admin, go home*/}
        return <Navigate to="/"/>;
    }
    return children;
}

export default ProtectedRoute;
