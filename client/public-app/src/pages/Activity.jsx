import {useEffect, useState} from "react";
import '../styles/Activity.css'
import {InputComponent} from "../components/InputComponent.jsx";
import {BannedList} from "../components/ActivityComponents/BannedList.jsx";
import {ActivityPopUp} from "../components/ActivityComponents/ActivityPopUp.jsx";
import {UserTable} from "../components/ActivityComponents/TableOfUsers.jsx";
import {Overlay} from "../components/ActivityComponents/Overlay.jsx";
import {PageSelector} from "../components/ActivityComponents/PageSelector.jsx";


/**
 * Activity page
 *
 * This is a part of the admin dashboard. On this page, the admin can review
 * all the comments and also delete inappropriate ones and block users from commenting
 *
 */


export const Activity = () => {


    const [comments, setComments] = useState([]); // Store all the comments
    const [searchQuery, setSearchQuery] = useState(""); // Set the search query input

    const [showPopup, setShowPopup] = useState(false); // State to display pop up window
    const [showOverlay, setShowOverlay] = useState(false); // State to display overlay

    const [inspectUserComment, setInspectUserComment] = useState(null); // Function to send data to render in pop up window
    const [bannedUsers, setBannedUsers] = useState([]); // List of banned users

    const [numberOfPages, setNumberOfPages] = useState(0); // Number of pages full of comments
    const [pageComments, setPageComments] = useState([[]]); // Filter the comments into a 2D array


    // Function to close pop up
    const closePopup = () => {
        setShowPopup(false);
        setShowOverlay(false)
    }

    // Function to open pop up
    const openPopup = (user) => {
        // user param is the data of the user who wrote the comment
        setShowPopup(true);
        setShowOverlay(true);
        setInspectUserComment(user)
    }

    // Function to toggle overlay
    const toggleOverlay = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowOverlay(false);
            setShowPopup(false);
        }
    }



    useEffect(() => {
        // Fetch all the comments
        fetch("/api/comments/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                const pages = commentsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPageComments(pages);
            })
            .catch(err => console.log(err));


        // Fetch all the banned users
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


    useEffect(() => {
        if (pageComments.length > 0) {
            setComments(pageComments[0]);
        }
    }, [pageComments]);


    const commentsIntoPages = (comments, commentsPerPage = 10) => {
        const pages = [];
        for (let i = 0; i < comments.length; i += commentsPerPage) {
            const page = comments.slice(i, i + commentsPerPage);
            pages.push(page);
        }
        return pages;
    }


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
            .then(data => {
                const pages = commentsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPageComments(pages);
                setComments(pages.length > 0 ? pages[0] : []);
            })
            .catch(err => console.log(err))
    }


    // Function to delete a comment, commetId is the id of the comment
    const deleteComment = async (commentId) => {
        try {
            // Delet request to back end
            const res = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // If delete was successful, update the comments
            if (res.ok) {
                const updatedComments = await fetch("/api/comments/all");
                const data = await updatedComments.json();

                const pages = commentsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPageComments(pages);
                setComments(pages.length > 0 ? pages[0] : []);
            } else {
                console.error("Failed to delete comment");
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Function to ban user, @param user is the user to ban
    const banUser = async (user) => {
        try {
            // Send a request to backend
            const res = await fetch(`/api/activity/ban`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user}),
            })

            // If ok, update the list of banned users to reflect changes
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

    // Function to unban users, @param user is the user getting unban
    const unBanUser = async (user) => {
        try {
            // Send a request to unban to back-end
            const res = await fetch(`/api/activity/unban`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({user}),
            })

            // If successful, fetch again to reflect changes
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



    // Sort comments by id
    const sortById = (e) => {
        setComments((prev) => {
            return [...prev].sort((a, b) => a.id - b.id)
        })
    }

    // Sort comments by date
    const sortByDate = () => {
        setComments((prev) => {
            return [...prev].sort((a,b) => {
                return a.created.localeCompare(b.created);
            })
        })
    }

    return (
        <main className="activity-container">

            <BannedList banned={bannedUsers} openPopup={openPopup}/>

            <section className="comments-section-container">
                <h2>Comments</h2>
                <div className="comments-filter-section">
                    <form onSubmit={handleSubmit}>
                        <InputComponent
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

                <UserTable deleteComment={deleteComment}
                           openPopup={openPopup}
                           bannedUsers={bannedUsers}
                           onClick={() => sortById(comments)}
                           sortDate={() => sortByDate()}
                           comments={comments}
                           numberOfPages={numberOfPages}
                           pageComments={pageComments}
                           setComments={setComments}
                />

            </section>

            <ActivityPopUp showPopup={showPopup}
                           onClick={() => closePopup()}
                           inspectUserComment={inspectUserComment}
                           bannedUsers={bannedUsers}
                           predicate={(user) => inspectUserComment.id === user.user_id}
                           unBan={() => {closePopup(); unBanUser(inspectUserComment);}}
                           ban={() => {closePopup(); banUser(inspectUserComment);
            }}/>

            <Overlay showOverlay={showOverlay} toggleOverlay={toggleOverlay}></Overlay>
        </main>)
}