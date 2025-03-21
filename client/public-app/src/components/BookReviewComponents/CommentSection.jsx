



import '../../styles/CommentSection.css'
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.jsx";
import {Link, useParams} from "react-router-dom";
import DOMPurify from "dompurify";
import {CommentCard} from "./CommentCard.jsx";


/**
 * This component is used to display the comment section for each book review
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const CommentSection = () => {


    const {id} = useParams(); // The id of the current review
    const {user} = useAuth(); // Get the current logged in user from context
    const [comments, setComments] = useState([]); // Comments for the book review
    const [bannedUsers, setBannedUsers] = useState([]); // List of banned users

    const [isDisabled, setIsDisabled] = useState(true); // Disable button to prevent empty comments
    const [chars, setChars] = useState(0); // The number of chars the comment has, used to update realtime
    const [loadedComments, setLoadedComments] = useState(5); // Show only 5 comments at once, user can select to load more

    const [errorShake, setErrorShake] = useState(false); // Error animation
    const [formData, setFormData] = useState({  // Update the state of the comment section
        comment: ''
    })

    // Handle input change for the new comment
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Sanitize to prevent XSS
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

    // Update the number of chars in the comment
    useEffect(() => {
        setChars(formData.comment.length);
    }, [formData.comment]);

    // For each letter the user writes, update the count
    const handleKeyDown = (e) => {
        setErrorShake(false);
        if (e.key === 'Backspace') {return;}

        // Comments can only be 50 chars!
        if (chars >= 50 && e.key !== 'Backspace') {
            e.preventDefault();
            setErrorShake(true);
        } else {
            setErrorShake(false);
        }
    };



    useEffect(() => {


        // Load the comments for the book review
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
                console.log(user);
            })
            .catch(err => console.log(err));

        // Get the list of banned users
        fetch("/api/activity/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setBannedUsers(data)
                console.log(data)
            })
            .catch(err => console.log(err))

    }, []);


    // Handle submit when users submits a new commment
    const handleSubmit = async (e) => {

        e.preventDefault();
        setFormData((prevData) => {
            return {
                ...prevData,
                comment: ''
            }
        })
        // Toggle disbled state of button
        setIsDisabled(false);

        try {
            // Send form to backend
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

            // If ok, update the comments with the new one aswell
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


    // Function to delete a comment
    const handleDelete = async (commentId) => {
        try {
            // Delete comment
            const res = await fetch(`/api/home/review/delete/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            // If delete was successful, fetch again to show the new comments
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
                                // If the post hast fewer than five comment, show all
                                <CommentCard comment={comment} handleDelete={handleDelete} user={user} />
                            ))
                        ) : (
                            // If the post has more than five comments, split them into 5 comments and display 5 more each time the user click load comments
                            comments.slice(0, loadedComments).map((comment) => (
                                <CommentCard comment={comment} handleDelete={handleDelete} user={user} />
                            ))
                        )}
                        </div>

                        {/*If amount of comments are more than five, display a "Load more" button to see five more */}
                        {loadedComments < comments.length && (
                            <p className="load-more-comments" onClick={() => setLoadedComments(loadedComments + 2)}>Load more</p>
                        )}
                    </>
                ) : null}
            </div>


            {/*If there is a logged in user*/}
            {user ? (

                // Check if the user is banne, if so, prevent them from commenting
                bannedUsers && bannedUsers.some((bannedUser) => bannedUser.user_id === user.id) ? (
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

                    // User not banned, allow comments
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

                // No logged in user
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