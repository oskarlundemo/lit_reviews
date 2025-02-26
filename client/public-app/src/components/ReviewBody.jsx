

import DOMPurify from "dompurify";


import '../styles/ReviewBody.css'
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {useAuth} from "../context/AuthContext.jsx";

export const ReviewBody = ({date, writer, body, title, reviewId}) => {

    /**
     * Sanitize the userdata
     */

    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);

    const {user} = useAuth();

    const sanitizedBody = DOMPurify.sanitize(body);

    const estimateReadingTime = (body) => {
        const averageReadingTime = 225;
        const words = body.split(' ').length;

        let readingTime = words / averageReadingTime;
        return Math.ceil(readingTime);
    }

    useEffect (() => {
        fetch(`/api/latest/like/${reviewId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => setLikes(data))
            .catch(err => console.log(err))

        isLikedByUser();
    }, [])


    useEffect(() => {
        if (likes.length !== null) {
            isLikedByUser();
        }
    }, [likes]);


    const isLikedByUser = () => {
        const token = localStorage.getItem('token');

        if (token && likes) {
            const { id } = jwtDecode(token);
            const userLiked = likes.some(like => like.user_id === id);
            setLiked(userLiked);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();

        if (user) {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`/api/latest/like/${reviewId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token ? `Bearer ${token}` : '',
                    },
                })


                if (res.ok) {
                    const updatedComments = await fetch(`/api/latest/like/${reviewId}`);
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

            <div dangerouslySetInnerHTML={{ __html: sanitizedBody }}/>
        </section>
    )


}