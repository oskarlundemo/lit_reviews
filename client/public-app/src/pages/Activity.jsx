import {useEffect, useState} from "react";
import '../styles/Activity.css'
import {InputFieldset} from "../components/InputFieldset.jsx";
import {BannedList} from "../components/BannedList.jsx";


/**
 * Activity page
 *
 * This is a part of the admin dashboard. On this page, the admin can review
 * all the comments and also delete inappropriate ones and even block users
 *
 */


export const Activity = () => {

    /**
     * comments: Store comments from the server
     * searchQuery: The search string entered by the user
     */


    const [comments, setComments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);

    const [inspectUserComment, setInspectUserComment] = useState(null);
    const [bannedUsers, setBannedUsers] = useState([]);


    const closePopup = () => {
        setShowPopup(false);
        setShowOverlay(false)
    }

    const openPopup = (user) => {
        setShowPopup(true);
        setShowOverlay(true);
        setInspectUserComment(user)
    }

    const toggleOverlay = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowOverlay(false);
            setShowPopup(false);
        }
    }

    /**
     * Fetch all the comments when the components mounts
     */

    useEffect(() => {
        fetch("/api/comments/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setComments(data);
            })
            .catch(err => console.log(err));
    }, [])


    useEffect(() => {
        fetch("/api/activity/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setBannedUsers(data))
            .catch(err => console.log(err))
    }, [])


    /**
     * Handle input change of the searchQuery field
     * @param e
     */

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(prev => value);
    }

    /**
     * Handle the submit from the searchform and send it to the backend
     * @param e
     */

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        fetch(`/api/comments/search?query=${encodeURIComponent(searchQuery)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.log(err))
    }


    const deleteComment = async (commentId) => {
        try {
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.ok) {
                const updatedComments = await fetch("/api/comments/all");
                const data = await updatedComments.json();
                setComments(data);
            } else {
                console.error("Failed to delete comment");
            }
        } catch (err) {
            console.log(err);
        }
    }


    const banUser = async (user) => {
        try {
            const res = await fetch(`/api/activity/ban`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user}),
            })

            if (res.ok) {
                fetch("/api/activity/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(res => res.json())
                    .then(data => setBannedUsers(data))
                    .catch(err => console.log(err))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const unBanUser = async (user) => {
        try {
            const res = await fetch(`/api/activity/unban`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user}),
            })

            if (res.ok) {
                fetch("/api/activity/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                    .then(res => res.json())
                    .then(data => setBannedUsers(data))
                    .catch(err => console.log(err))
            }

        } catch (err) {
            console.error(err)
        }
    }



    const sortById = (e) => {
        setComments((prev) => {
            return [...prev].sort((a, b) => a.id - b.id)
        })
    }

    const sortByTitle = () => {
        setComments((prev) => {
            return [...prev].sort((a,b) => {
                return a.title.localeCompare(b.title);
            })
        })
    }

    const sortByDate = () => {
        setComments((prev) => {
            return [...prev].sort((a,b) => {
                return a.created.localeCompare(b.created);
            })
        })
    }

    const sortByBook = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.Book.title.localeCompare(b.Book.title);
            })
        })
    }


    return (
        <main className="activity-container">


            <BannedList/>

            <section className="comments-section-container">
                <h2>Comments</h2>

                <div className="comments-filter-section">

                    <form onSubmit={handleSubmit}>
                        <InputFieldset
                            type="text"
                            id="search"
                            placeholder="Search"
                            example="Search in comments"
                            title="Search"
                            name="commentsQuery"
                            onChange={handleChange}
                            value={searchQuery}
                        />
                    </form>

                </div>

                {/* Comments Table */}
                {comments.length > 0 || comments ? (
                    <>
                    <table>
                        <thead>
                        <tr>
                            <th onClick={()=> sortById(comments)} scope="col">ID</th>
                            <th scope="col">Username</th>
                            <th scope="col">Comment</th>
                            <th onClick={()=> sortByDate()}scope="col">Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {comments.map((comment) => (
                            <tr key={comment.id}>
                                <td>{comment.id}</td>
                                <td>{comment.user.username}</td>
                                <td>{comment.comment}</td>
                                <td>{comment.created}</td>
                                <td>
                                    <div>
                                        {bannedUsers && bannedUsers.some(user => comment.user.id === user.user_id ) ? (
                                            <svg onClick={() => openPopup(comment.user)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M791-55 686-160H160v-112q0-34 17.5-62.5T224-378q45-23 91.5-37t94.5-21L55-791l57-57 736 736-57 57ZM240-240h366L486-360h-6q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm496-138q29 14 46 42.5t18 61.5L666-408q18 7 35.5 14t34.5 16ZM568-506l-59-59q23-9 37-29.5t14-45.5q0-33-23.5-56.5T480-720q-25 0-45.5 14T405-669l-59-59q23-34 58-53t76-19q66 0 113 47t47 113q0 41-19 76t-53 58Zm38 266H240h366ZM457-617Z"/></svg>
                                        ) : (
                                            <svg onClick={() => openPopup(comment.user)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                                        )}
                                        <svg onClick={() => deleteComment(comment.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </>
                ) : (
                    <p>"No comments found"</p>
                )}

            </section>

            <div className={`popup-module ${showPopup ? 'show' : ''}`}>
                <svg onClick={() => closePopup()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>

                {inspectUserComment ? (
                    bannedUsers && bannedUsers.some((user) => inspectUserComment.id === user.user_id) ? (
                        <>
                            <h2>Do you want to unban <span>{inspectUserComment.username} </span></h2>
                            <div className="button-container">
                                <button onClick={() => closePopup()} >Cancel</button>
                                <button onClick={() => {closePopup(); unBanUser(inspectUserComment);}} >Unban</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2>Do you want to ban <span>{inspectUserComment.username} </span></h2>
                            <div className="button-container">
                                <button onClick={() => closePopup()}>Cancel</button>
                                <button onClick={() => {closePopup(); banUser(inspectUserComment);}}>Ban</button>
                            </div>
                        </>
                    )
                ) : (
                    <p>Loading user..</p>
                )}
            </div>

            <div onClick={toggleOverlay} className={`overlay ${showOverlay ? 'active' : ''}`}></div>
        </main>)
}