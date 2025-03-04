

import '../styles/LatestReviews.css'
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ImageComponent} from "./ImageComponent.jsx";

export const LatestReviews = () => {

    const [reviews, setReviews] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("api/home/latest")
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.log("Error fetching reviews:", err));
    }, [location.pathname]);

    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    return (
        <div className="latest-reviews">

            <h2>Latest reviews</h2>

            <div className="latest-book-grid">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <article className="book-card" onClick={()=> inspectReview(review.Book.title, review.id)} key={review.id}>
                            <div className="book-card-header">
                                <div className="book-card-cover">
                                    <ImageComponent fileName={review.thumbnail} />
                                </div>

                                <div className="book-card-body">
                                    <h3>{review.Book.title}</h3>
                                    <h3>{review.Book.Author.name}</h3>
                                    <p className="book-description">{review.Book.about}</p>
                                </div>

                            </div>

                            <h3 className="read-more-link"><a href="#">Read more</a></h3>
                        </article>
                    ))
                ) : (
                    <p>Loading reviews...</p>
                )}

            </div>
        </div>
    )
}