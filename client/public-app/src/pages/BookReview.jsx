import {QouteSection} from "../components/BookReviewComponents/QouteSection.jsx";
import {ReviewBody} from "../components/BookReviewComponents/ReviewBody.jsx";
import {CommentSection} from "../components/BookReviewComponents/CommentSection.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import '../styles/BookReview.css'

/**
 * BookReview Component
 *
 * @returns {JSX.Element}
 */



export const BookReview= () => {

    const [review, setReview] = useState(null); // Store and set book reviews
    const {id} = useParams(); // Get the id of the book review through the params
    const [categories, setCategories] = useState([]); // Get the list of categories


    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    useEffect(() => {
        // Fetch the review data
        fetch(`${API_BASE_URL}/home/inspect/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error fetching review");
                }
                return res.json();
            })
            .then(data => setReview(data))
            .catch(err => console.log(err));
        // Get the categories for that book the review is about
        fetch(`${API_BASE_URL}/home/get-categories/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.log(err));
    }, [id])



    return (
        <main className="book-review">
            {review ? (
                <>
                    <QouteSection favoriteQoute={review.favoriteQuote} book={review.Book.title} author={review.Book.Author.name}/>
                    <ReviewBody reviewId={review.id} date={review.created.split('T')[0]} writer={review.User.username} body={review.body} title={review.title}/>
                    <CommentSection/>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    )
}