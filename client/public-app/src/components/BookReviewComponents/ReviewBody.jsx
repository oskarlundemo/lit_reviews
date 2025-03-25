
import DOMPurify from "dompurify";


import '../../styles/ReviewBody.css'
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../../context/AuthContext.jsx";


/**
 * This component is used for rendering the text component of the book review
 *
 * @param date when the review was written
 * @param writer who wrote it
 * @param body the text or review itself
 * @param title of the review
 * @param reviewId of the reivew
 * @returns {JSX.Element}
 * @constructor
 */


export const ReviewBody = ({date, writer, body, title, reviewId}) => {

    const [likes, setLikes] = useState([]); // The likes of the book review
    const [liked, setLiked] = useState(false); // Check if the logged in user has liked the post
    const [categories, setCategories] = useState([]); // The categories for the book
    const {user} = useAuth(); // Get the logged in user from the context

    const sanitizedBody = DOMPurify.sanitize(body); // Sanitize the body since it is saved with tags ex <p>
    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    // Function to estimate the time to read the review
    const estimateReadingTime = (body) => {

        // Average reading time of a human per minute
        const averageHumanReadingTimePerMinute = 225;

        // Split the body, and count each space a word
        const words = body.split(' ').length;

        // Divide the number of words / by avg
        let readingTime = words / averageHumanReadingTimePerMinute;
        return Math.ceil(readingTime);
    }

    useEffect (() => {

        // Get the likes for the book review
        fetch(`${API_BASE_URL}/home/like/${reviewId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => setLikes(data))
            .catch(err => console.log(err));
        // Get the categories about the book
        fetch(`${API_BASE_URL}/home/get-categories/${reviewId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                console.log(data);
            })
            .catch(err => console.log(err));

        // Check if the logged-in user already likes the post
        isLikedByUser();
    }, [])


    // If the number of likes is 0, then  always set user liked to false
    useEffect(() => {
        if (likes.length !== null) {
            isLikedByUser();
        }
    }, [likes]);


    // Function to check if the user has liked the review
    const isLikedByUser = () => {
        const token = localStorage.getItem('token');

        // If there is a token (logged in) and the there a likes
        if (token && likes) {
            const { id } = jwtDecode(token);
            // Check if logged in user is in the list of likes
            const userLiked = likes.some(like => like.user_id === id);
            setLiked(userLiked);
        }
    };


    // Triggered when the user click the like button
    const handleLike = async (e) => {
        e.preventDefault();

        // If there is a logged-in user
        if (user) {

            // Parse their jwt token
            const token = localStorage.getItem('token');

            try {
                // Update that the user clicked the button
                const res = await fetch(`${API_BASE_URL}/home/like/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                })

                // If the like was ok, fetch again to update the number of likes
                if (res.ok) {
                    const updatedComments = await fetch(`/api/home/like/${reviewId}`);
                    const data = await updatedComments.json();
                    setLikes(data);
                }

            } catch (err) {
                console.log(err)
            }
        }
    }


    return (
        <section className="review-body">
            <div className="review-body-header">
                <div>
                    <form>
                        {likes && likes.length > 0 ? (
                            <p>{likes.length}</p>
                        ) : (
                            <p>0</p>
                        )}
                        <svg className={liked ? 'liked' : ''} onClick={handleLike} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                    </form>

                    <p>@{writer} / {date}</p>
                </div>

                <div>
                    <p>{estimateReadingTime(body)} min</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M274-360q31 0 55.5-18t34.5-47l15-46q16-48-8-88.5T302-600H161l19 157q5 35 31.5 59t62.5 24Zm412 0q36 0 62.5-24t31.5-59l19-157H659q-45 0-69 41t-8 89l14 45q10 29 34.5 47t55.5 18Zm-412 80q-66 0-115.5-43.5T101-433L80-600H40v-80h262q44 0 80.5 21.5T440-600h81q21-37 57.5-58.5T659-680h261v80h-40l-21 167q-8 66-57.5 109.5T686-280q-57 0-102.5-32.5T520-399l-15-45q-2-7-4-14.5t-4-21.5h-34q-2 12-4 19.5t-4 14.5l-15 46q-18 54-63.5 87T274-280Z"/></svg>
                </div>
            </div>
            <h1>{title}</h1>

            {categories.length > 0 && (
                <div className="book-category-container">
                    {categories.map((c, index) => (
                        <p key={index}>{c.category.category}</p>
                    ))}
                </div>
            )}


            <div style={{ color: "var(--text-color)" }}
                dangerouslySetInnerHTML={{ __html: sanitizedBody }}/>
        </section>
    )


}