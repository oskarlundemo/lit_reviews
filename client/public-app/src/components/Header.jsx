import '../styles/Header.css';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";


/**
 * This component is just the header
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const Header = () => {
    const { user, logout } = useAuth(); // Get the logged-in user and log out function from context
    const navigate = useNavigate(); // Used for navigating once logged out// or clicked "Home"

    // Function to set light or dark mode in css
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    // Used for updating the color theme of the application
    useEffect(() => {
        const themeFromLocalStorage = localStorage.getItem("theme");
        const isDarkMode = themeFromLocalStorage === "dark";
        setDarkMode(isDarkMode);

        if (isDarkMode) {
            document.querySelector('.App').classList.add("dark");
        } else {
            document.querySelector('.App').classList.add("light");
        }
    }, []);

    // Used for updating the color theme of the application
    useEffect(() => {
        if (darkMode) {
            document.querySelector('.App').classList.add("dark");
            document.querySelector('.App').classList.remove('light');
            localStorage.setItem("theme", "dark");
        } else {
            document.querySelector('.App').classList.remove('dark');
            document.querySelector('.App').classList.add("light");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);


    return (
        <header className="App-header">
            {/* Takes user to homepage*/}
            <Link to="/"><h1>Lit reviews</h1></Link>
            <nav>
                {/* Is there a logged-in user ?*/}
                {user ? (
                    <>
                        <p className="welcome-user">{user.username}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>
                        {/* Display the dashboard shortcut if the user is an admin */}
                        {user.admin ? (
                            <>
                            <div className="admin-container">
                                <Link to="/dashboard">
                                    <div>
                                        <p>Admin</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                            <path d="M120-520v-320h320v320H120Zm0 400v-320h320v320H120Zm400-400v-320h320v320H520Zm0 400v-320h320v320H520ZM200-600h160v-160H200v160Zm400 0h160v-160H600v160Zm0 400h160v-160H600v160Zm-400 0h160v-160H200v160Zm400-400Zm0 240Zm-240 0Zm0-240Z"/>
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                                {/* Takes user to homepage after logout*/}
                                <button onClick={() => { logout(); redirect(); }}>Sign out</button>
                            </>
                            ) : (
                                <>
                                    {/* Takes user to homepage after logout*/}
                                    <button onClick={() => { logout(); navigate('/'); }}>Sign out</button>
                                </>
                        )}
                    </>
                ) : (
                    <>
                        {/*Options if the user is not logged-in*/}
                        <Link to="/login">Sign in</Link>
                        <Link to="/create-user">Sign up</Link>
                    </>
                )}
                <div className="dark-mode-toggle" onClick={toggleDarkMode}>
                    {/*SVG:s change depending on current theme*/}
                    {darkMode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
                    )}
                </div>
            </nav>
        </header>
    );
};
