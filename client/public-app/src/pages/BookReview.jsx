import {QouteSection} from "../components/QouteSection.jsx";
import {ReviewBody} from "../components/ReviewBody.jsx";
import {CommentSection} from "../components/CommentSection.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import '../styles/BookReview.css'

export const BookReview= () => {

    const [review, setReview] = useState(null);
    const {id} = useParams();

    useEffect(() => {
        fetch(`/latest/${id}`)

            .then(res => {
                if (!res.ok) {
                    throw new Error("Error fetching review");
                }
                return res.json();
            })
            .then(data => setReview(data))
            .catch((err) => console.log(err));
    }, [id])



    return (
        <main className="book-review">
            {review ? (
                <>
                    <QouteSection favoriteQoute={review.favouriteQuoute} book={review.Book.title} author={review.Book.Author.name}/>
                    <ReviewBody writer={review.User.username} body={review.body} title={review.title}/>
                    <CommentSection/>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    )
}