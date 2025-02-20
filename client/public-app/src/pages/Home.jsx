import {AboutSection} from "../components/AboutSection.jsx";
import {LatestReviews} from "../components/LatestReviews.jsx";
import {Footer} from "../components/Footer.jsx";
import {useEffect, useState} from "react";
import '../styles/Home.css'


export default function Home  () {
    const [getUsers, setUsers] = useState([]);


    return (
        <div className="home-container">
            <AboutSection/>
            <LatestReviews/>
            <Footer/>
        </div>
    )
}