import { useEffect, useState } from "react";
import '../../styles/AllBookReviews.css'
import { useNavigate } from "react-router-dom";
import { BookCard } from "./BookCard.jsx";
import { CategoryBox } from "./CategoryBox.jsx";


/**
 * This component is a section in the homePage.jsx, used for displaying all the book reviews
 * @param numberOfReviews
 * @param likes
 * @param comments
 * @param categories
 * @returns {JSX.Element}
 * @constructor
 */


export const AllBookReviews = ({ numberOfReviews, likes, comments, categories }) => {
    const [bookReviews, setBookReviews] = useState([]); // Holds the original reviews
    const [filteredReviews, setFilteredReviews] = useState([]); // Holds the filtered reviews
    const navigate = useNavigate(); // Navigate to read full review
    const [loadingError, setLoadingError] = useState(''); // Loading error
    const [displayedReviews, setDisplayedReviews] = useState(4); // Only display 4 reviews first
    const [loading, setLoading] = useState(true); // Update loading

    useEffect(() => {
        // Get all the book reviews
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

    // User clicked on a review, take the to the full review
    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    // Filter reviews based on category
    const handleFilter = (filtered) => {
        setFilteredReviews(filtered);
    };


    return (
        <>
            <section className={`reviews-grid`}>
                <h2 className="home-title">All reviews</h2>

                <CategoryBox numberOfReviews={numberOfReviews} setReviews={handleFilter} allReviews={bookReviews} />

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
                        <div className="loading-reviews"></div>
                    )}
                </div>

                {/*If there are more reviews than 4, display a button to load more */}
                {filteredReviews.length > displayedReviews && (
                    <button onClick={() => setDisplayedReviews(displayedReviews + 4)} className="load-more-btn">
                        Load More
                    </button>
                )}
            </section>
        </>
    )
}
