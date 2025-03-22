import {ImageComponent} from "../ImageComponent.jsx";


/**
 * This component is used for rendering a book card, used in the AboutSection.jsx and AllBookReviews.jsx component
 *
 * @param review itself
 * @param comments the comments for that book review
 * @param likes for that book review
 * @param inspectReview function that takes the user to the page were they can read the review
 * @param categories for the book the review is about
 * @returns {JSX.Element}
 * @constructor
 */



export const BookCard = ({review, comments, likes, inspectReview, categories = []}) => {


    return (
        <article
            className="book-review-card"
            key={review.id}
            onClick={() => inspectReview(review.Book.title, review.id)}>

            <div className="book-review-card-wrapper">
                {/*Thumbail section*/}
            <div className="book-card-cover">
                <ImageComponent fileName={review.thumbnail} />
            </div>

            <div className="content">
                <div className="interactions">
                    {/*Filter through the likes to check if there are any for this post*/}
                    {likes && likes.length > 0 && (
                        <p>{likes.filter((like) => like.post_id === review.id).length}</p>
                    )}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                    >
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>

                    {/*Filter through the comments to check if there are any for this post*/}
                    {comments && comments.length > 0 && (
                        <p>
                            {comments.filter((comment) => comment.post_id === review.id).length}
                        </p>
                    )}

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000000"
                    >
                        <path d="M240-400h480v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM880-80 720-240H160q-33 0-56.5-23.5T80-320v-480q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v720ZM160-320h594l46 45v-525H160v480Zm0 0v-480 480Z" />
                    </svg>
                </div>

                <div className="book-card-body">
                    <h2>{review.Book.title}</h2>
                    <h3>{review.Book.Author.name}</h3>
                    <p className="book-description">{review.Book.about}</p>
                </div>
            </div>
            </div>

            <div className="book-card-footer">
                {/*Filter through the categories to check if there are any for this post*/}
                {categories &&
                    categories.length > 0 &&
                    categories
                        .filter((cat) => cat.book_id === review.Book.id)
                        .map((cat) => (
                            <p key={cat.category_id}>{cat.category.category}</p>
                        ))}
            </div>

        </article>

    )
}