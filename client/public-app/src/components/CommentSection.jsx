



import '../styles/CommentSection.css'
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {Link, useParams} from "react-router-dom";
import DOMPurify from "dompurify";


export const CommentSection = () => {

    const {id} = useParams();
    const {user} = useAuth();
    const [comments, setComments] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [chars, setChars] = useState(0);

    const [errorShake, setErrorShake] = useState(false);
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
        if (chars >= 50 && e.key !== 'Backspace') {
            e.preventDefault();
            setErrorShake(prev => !prev);
        } else {
            setErrorShake(false);
        }
    };

    useEffect(() => {
        fetch(`/api/latest/${id}/comments`, {
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
    }, [comments]);


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

        fetch(`/api/latest/${id}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }


    const handleDelete = (commentId, userid) => {
        const token = localStorage.getItem("token");
        fetch(`/api/latest/${id}/comments/${commentId}/${userid}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            },
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }



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
                        <div key={comment.id} className="comment-card">
                            <div className="comment-card-header">
                                <p>@{comment.user.username}</p>
                                <div>
                                    <p>{comment.created.split('T')[0]}</p>

                                    {user && (user.id === comment.user_id || user.admin)  ? (
                                        <svg onClick={() => handleDelete(comment.id, comment.user.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    ) : null}
                                </div>
                            </div>

                            <div className="comment-card-body">
                                <p>{comment.comment}</p>
                            </div>
                        </div>
                    ))
                ) : null}
            </div>

            {user ? (
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        value={formData.comment}
                        name="comment"
                        id="comment-input"
                        className={errorShake ? 'shake' : ''}
                    />
                    <p className={errorShake ? 'error' : ''}>  {chars} / 50</p>
                    <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Submit</button>
                </form>
            ) : (


                <form onSubmit={handleSubmit}>
                    <input
                        name="comment"
                        id="comment-input"
                        disabled={true}
                    />
                    <p className={errorShake ? 'error' : ''}>  {chars} / 50</p>
                    <button className="disabled" type="submit" disabled={true}>Submit</button>
                    <p className="login-message"><Link to ="/login" >Login</Link> to share your thoughts! 💭</p>
                </form>

            )}

        </section>
    )
}