



import '../styles/CommentSection.css'
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {useParams} from "react-router-dom";

import DOMPurify from "dompurify";


export const CommentSection = () => {

    const {id} = useParams();

    const {user} = useAuth();
    const [comments, setComments] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [chars, setChars] = useState(0);

    const [formData, setFormData] = useState({
        comment: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue =  DOMPurify.sanitize(value);
        setFormData((prevData) => {
                const updatedData = {
                    ...prevData,
                    [name]: sanitizedValue
                };
                setIsDisabled(!(updatedData.comment))
                return updatedData;
            });
    }

    useEffect(() => {
        setChars(formData.comment.length);
    }, [formData.comment]);

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {return;}
        if (chars >= 50 && e.key !== 'Backspace') {e.preventDefault();}
    };


    useEffect(() => {
        fetch(`/latest/${id}/comments`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                setComments(data);
            })
            .catch(err => console.log(err));
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        setFormData((prevData) => {
            return {
                ...prevData,
                comment: ''
            }
        })

        setIsDisabled(false);
        const token = localStorage.getItem("token");

        fetch(`/latest/${id}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
        })
            .then(res => res.json())
            .then(newComment => {
                setComments(prevComments => [newComment, ...prevComments]);

                setFormData({ comment: "" });
            })
            .catch(err => console.log(err))
    }


    if (user) {
        return (
                <section className="comment-section">

                    {comments.length === 1 ? (
                        <h3>{comments.length} Comment</h3>
                    ) : (
                        <h3>{comments.length} Comments</h3>
                    )}


                    <div className="comment-section-comments">

                        {comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="comment-card">
                                    <p>@{comment.user.username}</p>
                                    <p>{comment.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments yet!</p>
                        )}

                    </div>

                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            value={formData.comment}
                            name="comment"
                            id="comment-input"
                        />
                        <p>{chars} / 50</p>
                        <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Submit</button>
                    </form>

                </section>
            )
    }



    return (
        <section className="comment-section">

            <h3>3 Comments</h3>
            <div className="comment-section-comments">

            </div>

        </section>
    )
}