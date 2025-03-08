



import '../../styles/CommentSection.css'
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Link, useParams} from "react-router-dom";
import DOMPurify from "dompurify";
import {CommentCard} from "./CommentCard.jsx";


export const CommentSection = () => {

    const {id} = useParams();
    const {user} = useAuth();
    const [comments, setComments] = useState([]);
    const [bannedUsers, setBannedUsers] = useState([]);

    const [isDisabled, setIsDisabled] = useState(true);
    const [chars, setChars] = useState(0);

    const [loadedComments, setLoadedComments] = useState(5);


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
        setErrorShake(false);
        if (e.key === 'Backspace') {return;}
        if (chars >= 50 && e.key !== 'Backspace') {
            e.preventDefault();
            setErrorShake(true);
        } else {
            setErrorShake(false);
        }
    };

    useEffect(() => {
        fetch(`/api/home/${id}/comments`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(data => {
                setComments(data);
                setErrorShake(false);
            })
            .catch(err => console.log(err));


        fetch("/api/activity/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setBannedUsers(data))
            .catch(err => console.log(err))

    }, []);


    const handleSubmit = async (e) => {

        e.preventDefault();
        setFormData((prevData) => {
            return {
                ...prevData,
                comment: ''
            }
        })

        setIsDisabled(false);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/home/review/create/comment/${id}`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
            })
            const responseData = await res.json();

            if (res.ok) {
                const updatedComments = await fetch(`/api/home/${id}/comments`);
                const data = await updatedComments.json();
                setComments(data);
            } else {
                console.error("Failed to create comment:", responseData);
            }
        } catch (err) {
            console.error(err)
        }
    }


    const handleDelete = async (commentId) => {
        try {
            const res = await fetch(`/api/home/review/delete/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const updatedComments = await fetch(`/api/home/${id}/comments`);
                const data = await updatedComments.json();
                setComments(data);
            } else {
                console.error("Failed to delete comment");
            }
        } catch (err) {
            console.error(err)
        }
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
                    <>

                        <div className="comments-container">
                        {comments.length < 5 ? (
                            comments.map((comment) => (
                                <CommentCard comment={comment} handleDelete={handleDelete} user={user} />
                            ))
                        ) : (
                            comments.slice(0, loadedComments).map((comment) => (
                                <CommentCard comment={comment} handleDelete={handleDelete} user={user} />
                            ))
                        )}
                        </div>

                        {loadedComments < comments.length && (
                            <p className="load-more-comments" onClick={() => setLoadedComments(loadedComments + 2)}>Load more</p>
                        )}
                    </>
                ) : null}
            </div>



            {user ? (
                bannedUsers && bannedUsers.some((user) => user.id === user.id) ? (
                    <div className="banned-input">
                        <form className="banned-form">
                            <input
                                disabled="disabled"
                                placeholder="Your account is suspended from commenting"
                            />
                            <p> 0 / 50</p>
                            <button className="disabled" disabled="disabled">Submit</button>
                        </form>
                    </div>
                ) : (
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
                )
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        name="comment"
                        id="comment-input"
                        disabled={true}
                    />
                    <p> {chars} / 50</p>
                    <button className="disabled" type="submit" disabled={true}>Submit</button>
                    <p className="login-message"><Link to ="/login" >Login</Link> to share your thoughts! 💭</p>
                </form>
            )}

        </section>
    )
}