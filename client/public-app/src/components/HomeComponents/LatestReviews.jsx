

import '../../styles/LatestReviews.css'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {BookCard} from "./BookCard.jsx";


/**
 * This component is used to display the latest book reviews on the page
 *
 * @param comments for each review
 * @param categories for each review
 * @param likes for each review
 * @returns {JSX.Element}
 * @constructor
 */


export const LatestReviews = ({comments, categories, likes}) => {

    const [reviews, setReviews] = useState([]); // Store the three latest reviews
    const location = useLocation(); // So users can click on a review that takes them to the article / review
    const navigate = useNavigate(); // See above
    const [loading, setLoading] = useState(true); // Update loading state

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development


    useEffect(() => {
        // Get the three latest book reviews from back end
        fetch(`${API_BASE_URL}/home/latest`)
            .then((res) => res.json())
            .then((data) => {
                setReviews(data);
                setLoading(false);
            })
            .catch((err) => console.log("Error fetching reviews:", err));
    }, [location.pathname]);

    // User clicks on a BookCard that takes the to the full review
    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    return (
        <section className={`latest-reviews`}>
            <h2 className="home-title">Latest reviews</h2>
            <div className={`latest-book-grid ${loading ? 'loading' : ''}`}>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <BookCard
                            categories={categories} key={review.id}
                            review={review} likes={likes} inspectReview={inspectReview}
                            comments={comments}/>
                    ))
                ) : null}
            </div>
        </section>
    )
}