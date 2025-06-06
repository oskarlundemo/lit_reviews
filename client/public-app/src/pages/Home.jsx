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

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    useEffect(() => {

        // Fetch all the likes from the back-end
        fetch(`${API_BASE_URL}/home/likes/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => setLikes(data))
            .catch((err) => {
                console.log(err)
            });

        // Fetch all the comments from the back-end
        fetch(`${API_BASE_URL}/home/comments/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => setComments(data))
            .catch((err) => {
                console.log(err)
            });

        // Fetch all the book categories from the back-end
        fetch(`${API_BASE_URL}/home/categories/books/`, {
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
            });

        // Fetch the number of reviews from the back-end
        fetch(`${API_BASE_URL}/home/reviews/number`, {
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