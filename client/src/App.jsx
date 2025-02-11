import { useState, useEffect } from 'react'

import './App.css'

function App() {
    const [backendUsers, setBackendUsers] = useState(null); // Start with null

    useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => {
                console.log("API Response:", data);
                setBackendUsers(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            {backendUsers === null ? (  // Check if data is still loading
                <p>Loading...</p>
            ) : backendUsers.users && backendUsers.users.length > 0 ? (  // Ensure users exists and has data
                backendUsers.users.map((user, i) => (
                    <p key={i}>{user}</p>  // Render each user
                ))
            ) : (
                <p>No users found.</p>  // Show a message if there are no users
            )}
        </div>
    );
}

export default App;
