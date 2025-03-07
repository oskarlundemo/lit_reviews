

import '../../styles/LatestReviews.css'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ImageComponent} from "../ImageComponent.jsx";
import {BookCard} from "./BookCard.jsx";

export const LatestReviews = ({comments, likes}) => {

    const [reviews, setReviews] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch("api/home/latest")
            .then((res) => res.json())
            .then((data) => {
                setReviews(data)
                setLoading(false);
            })
            .catch((err) => console.log("Error fetching reviews:", err));
    }, [location.pathname]);

    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    return (
        <div className={`latest-reviews`}>

            <h2>Latest reviews</h2>
            <div className={`latest-book-grid ${loading ? 'loading' : ''}`}>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <BookCard
                        key={review.id}
                        review={review}
                        likes={likes}
                        inspectReview={inspectReview}
                        comments={comments}/>
                    ))
                ) : null}
            </div>
        </div>
    )
}