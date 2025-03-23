import {AboutSection} from "../components/HomeComponents/AboutSection.jsx";
import {LatestReviews} from "../components/HomeComponents/LatestReviews.jsx";
import {Footer} from "../components/HomeComponents/Footer.jsx";
import '../styles/Home.css'
import {AllBookReviews} from "../components/HomeComponents/AllBookReviews.jsx";
import {useEffect, useState} from "react";


/**
 * This is the homepage of the application
 *
 * @returns {JSX.Element}
 * @constructor
 */



export default function Home  () {


    const [likes, setLikes] = useState([]); // List of likes
    const [comments, setComments] = useState([]); // List of all comments
    const [categories, setCategories] = useState([]); // List of all categories for each book
    const [numberOfReviews, setNumberOfReviews] = useState(0); // Number of book reviews

    useEffect(() => {

        // Fetch all likes from the back-end
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

        // Fetch all the comments from the back-end
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

        // Fetch all the book categoreis from the back-end
        fetch(`/api/home/categories/books/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => {
                setCategories(data)
            })
            .catch((err) => {
                console.log(err)
            })

        // Fetch the nuumber of reviews from the back-end
        fetch('api/home/reviews/number', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setNumberOfReviews(data);
            })
            .catch(err => console.log(err));

    }, [])


    return (
        <main className="home-container">
            <AboutSection numberOfReviews={numberOfReviews} />
            <LatestReviews categories={categories} comments={comments} likes={likes} />
            <AllBookReviews numberOfReviews={numberOfReviews} categories={categories} comments={comments} likes={likes}/>
            <Footer/>
        </main>
    )
}