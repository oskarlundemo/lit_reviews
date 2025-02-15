import {AboutSection} from "../components/AboutSection.jsx";
import {LatestReviews} from "../components/LatestReviews.jsx";
import {Footer} from "../components/Footer.jsx";
import {useEffect, useState} from "react";


export default function Home  () {
    const [getUsers, setUsers] = useState([]);


    useEffect(() => {
        fetch('/api')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);


    return (
        <main>
            <AboutSection/>
            <LatestReviews/>

            {(getUsers.length === 0) ? (
                <p>Loading...</p>
            ) : (
                getUsers.users.map((user, i) => {
                    return <p key={i}>{user}</p>
                })
            )}
            <Footer/>
        </main>
    )
}