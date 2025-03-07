import {AboutSection} from "../components/HomeComponents/AboutSection.jsx";
import {LatestReviews} from "../components/HomeComponents/LatestReviews.jsx";
import {Footer} from "../components/HomeComponents/Footer.jsx";
import '../styles/Home.css'
import {AllBookReviews} from "../components/HomeComponents/AllBookReviews.jsx";
import {useEffect, useState} from "react";


export default function Home  () {


    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch('/api/home/likes/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => setLikes(data))
            .catch((err) => {
                console.log(err)
            })


        fetch('/api/home/comments/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => setComments(data))
            .catch((err) => {
                console.log(err)
            })
    }, [])


    return (
        <main className="home-container">
            <AboutSection/>
            <LatestReviews comments={comments} likes={likes} />
            <AllBookReviews comments={comments} likes={likes}/>
            <Footer/>
        </main>
    )
}