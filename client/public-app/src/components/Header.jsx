

import '../styles/Header.css';
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";



export const Header = () => {
    const {user, logout} = useAuth();


    if (user) {
        return (
            <header className="App-header">
                <Link to="/"><h1>Lundemo's library</h1></Link>
                <nav>
                    {user.admin ? (
                        <div className="admin-container">
                            <p>Welcome {user.username}</p>
                            <Link to="/dashboard">Admin Dashboard</Link>
                        </div>
                    ) : (
                        <p>Welcome {user.username}</p>
                    )}
                    <button onClick={logout}>Sign out</button>
                </nav>
            </header>
        );
    }


    return (
        <header className="App-header">
            <Link to="/"><h1>Lundemo's library</h1></Link>

            <nav>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>

                <Link to="/login">Sign in</Link>
                <Link to="/create-user">Sign up</Link>
            </nav>
        </header>
    )
}