import {AboutSection} from "../components/AboutSection.jsx";
import {LatestReviews} from "../components/LatestReviews.jsx";
import {Footer} from "../components/Footer.jsx";
import {useEffect, useState} from "react";
import '../styles/Home.css'


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
        <div className="home-container">
            <AboutSection/>
            <LatestReviews/>
            <Footer/>
        </div>
    )
}