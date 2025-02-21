

import '../styles/LatestReviews.css'
import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

export const LatestReviews = () => {

    const [reviews, setReviews] = useState([]);

    const location = useLocation(); // ✅ Detects route changes

    useEffect(() => {
        fetch("/latest")
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.log("Error fetching reviews:", err));
    }, [location.pathname]); // ✅ Re-fetches on navigation to "/"


    return (
        <div className="latest-reviews">

            <h2>Latest reviews</h2>

            <div className="latest-book-grid">

                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <article className="book-card" key={review.id}>
                            <div className="book-card-text">
                            <div className="book-card-header">
                                <div className="book-card-cover">
                                    <img src={review.image || "/images/retro-book.png"} alt={review.title} />
                                </div>
                                <h3>{review.Book.title}</h3>
                                <h3>{review.Book.Author.name}</h3>

                                <p className="book-description">{review.Book.about}</p>
                            </div>
                            </div>

                            <h3><a href="#">Read more</a></h3>
                        </article>
                    ))
                ) : (
                    <p>Loading reviews...</p>
                )}

            </div>
        </div>
    )
}