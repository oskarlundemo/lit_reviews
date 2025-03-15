import { useEffect, useState } from "react";
import '../../styles/AllBookReviews.css'
import { useNavigate } from "react-router-dom";
import { BookCard } from "./BookCard.jsx";
import { CategoryBox } from "./CategoryBox.jsx";

export const AllBookReviews = ({ likes, comments, categories }) => {
    const [bookReviews, setBookReviews] = useState([]); // Holds the original reviews
    const [filteredReviews, setFilteredReviews] = useState([]); // Holds the filtered reviews
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
                setBookReviews(data)  // Set all reviews once they are fetched
                setFilteredReviews(data)  // Initialize filteredReviews with all reviews
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

    const handleFilter = (filtered) => {
        setFilteredReviews(filtered);
    };


    return (
        <>
            <section className={`reviews-grid`}>
                <h2>All reviews</h2>

                <CategoryBox setReviews={handleFilter} allReviews={bookReviews} />

                <div className={`reviews-container ${loading ? "loading" : ""}`}>
                    {filteredReviews.length > 0 ? (
                        <>
                            {filteredReviews.slice(0, displayedReviews).map((review) => (
                                <BookCard
                                    key={review.id}
                                    review={review}
                                    comments={comments}
                                    likes={likes}
                                    inspectReview={inspectReview}
                                    categories={categories}
                                />
                            ))}
                        </>
                    ) : (
                        <div className="loading-reviews">No reviews to display</div>
                    )}
                </div>

                {filteredReviews.length > displayedReviews && (
                    <button onClick={() => setDisplayedReviews(displayedReviews + 4)} className="load-more-btn">
                        Load More
                    </button>
                )}
            </section>
        </>
    )
}
