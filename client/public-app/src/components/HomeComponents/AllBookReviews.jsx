import {useEffect, useState} from "react";


import '../../styles/AllBookReviews.css'
import {useNavigate} from "react-router-dom";
import {BookCard} from "./BookCard.jsx";

export const AllBookReviews = ({likes, comments}) => {


    const [bookReviews, setBookReviews] = useState([]);
    const navigate = useNavigate();
    const [loadingError, setLoadingError] = useState('');
    const [displayedReviews, setDisplayedReviews] = useState(4);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        fetch('/api/home/reviews/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then((data) => {
                setBookReviews(data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                setLoadingError(err.message);
                console.log(err);
            })
    }, [])


    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    return (
        <>

            <section className={`reviews-grid`}>
                <h2>All reviews</h2>

                <div className={`reviews-container ${loading ? "loading" : ""}`}>
                    {bookReviews.length > 0 ? (
                        <>
                            {bookReviews.slice(0, displayedReviews).map((review) => (
                                <BookCard
                                    key={review.id}
                                    review={review}
                                    comments={comments}
                                    likes={likes}
                                    inspectReview={inspectReview}
                                />
                            ))}

                        </>
                    ) : (
                        <div className="loading-reviews"></div>
                    )}
                </div>

                {bookReviews.length > displayedReviews && (
                    <button onClick={() => setDisplayedReviews(displayedReviews + 4)} className="load-more-btn">
                        Load More
                    </button>
                )}
            </section>

        </>
    )

}