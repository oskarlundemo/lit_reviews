import {InputComponent} from "../components/InputComponent.jsx";
import {useEffect, useState} from "react";


import '../styles/Posts.css'
import {PostsPopUp} from "../components/PostsComponents/PostsPopUp.jsx";
import {Overlay} from "../components/ActivityComponents/Overlay.jsx";
import {PostsTable} from "../components/PostsComponents/PostsTable.jsx";


/**
 * This is an page for the admin to quickly glance over all the book reviews and edit them if need
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const Posts = () => {


    const [posts, setPosts] = useState([]) // ALl the book reviews
    const [inspectPost, setInspectPost] = useState(null) // Inspect a specific post
    const [showPopup, setShowPopup] = useState(false) // Toggle pop up c
    const [showOverlay, setShowOverlay] = useState(false) // Toggle overlay
    const [numberOfPages, setNumberOfPages] = useState(0) // The number of pages filled with 10 book reviews each
    const [pagePosts, setPagePosts] = useState([[]]); // Each page contain 10 post

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    // Update searchquery data
    const [formData, setFormData] = useState({
        search: "",
    });

    // Handle updating state
    const handleInputChange = (e) => {
        const {value, name} = e.target;
        setFormData((prev) => {
            const updatedData = {
                ...prev,
                [name]: value
            }
            return updatedData
        })
    }

    // Parse all the posts into pages of 10 posts per page
    const postsIntoPages = (posts, postsPerPage = 10) => {
        const pages = [];
        for (let i = 0; i < posts.length; i += postsPerPage) {
            const page = posts.slice(i, i + postsPerPage);
            pages.push(page);
        }
        return pages;
    }


    useEffect(() => {
        // Get all posts from the back-end
        const token = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/posts`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const pages = postsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPagePosts(pages);
            })
            .catch(err => console.log(err));
    }, [])


    // If admin switches pages, change index in array
    useEffect(() => {
        if (pagePosts.length > 0) {
            setPosts(pagePosts[0]);
        }
    }, [pagePosts]);


    // Parse title for better readability
    const parseTitle = (title) => {
        if (title && title.length > 40) {
            let splitTitle = title.substring(0, 40);
            let lastSpace = splitTitle.lastIndexOf(" ");
            return title.substring(0, lastSpace) + ' ...';
        } else
            return title;
    }

    // Close pop up
    const closePopup = () => {
        setShowPopup(false);
        setShowOverlay(false)
    }

    // Inspect a specific post
    const inspectClick = (postId) => {
        const token  = localStorage.getItem("token");
        setShowPopup(true);
        setShowOverlay(true);

        fetch(`${API_BASE_URL}{postId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {setInspectPost(data)})
            .catch(err => console.log(err));
    }


    // Handle submit search
    const handleSubmitSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        fetch(`${API_BASE_URL}posts/search?query=${encodeURIComponent(formData.search)}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then((res) => res.json())
            .then((data => {
                const pages = postsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPagePosts(pages);
            }))
            .catch(err => console.log(err));
    }

    // Delete a specific post / book review
    const deleteClick = (postId) => {
        const token  = localStorage.getItem("token");
        fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                const pages = postsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPagePosts(pages);
            })
            .catch(err => console.log(err));

        closePopup();
    }

    // Toggle overlay
    const toggleOverlay = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowOverlay(false);
            setShowPopup(false);
        }
    }

    return (
        <main className="posts">

            <div className="posts-search-form">
                <form onSubmit={handleSubmitSearch}>
                    <InputComponent
                        title="Search for posts"
                        type="text"
                        name="search"
                        example="Search for posts"
                        id="search"
                        onChange={handleInputChange}
                        value={formData.search}
                        />
                </form>
            </div>

            <section className="search-result">
                <PostsTable
                    setPosts={setPosts}
                    posts={posts}
                    parseTitle={parseTitle}
                    inspectClick={inspectClick}
                    numberOfPages={numberOfPages}
                    pagePosts={pagePosts}
                />
            </section>

            <PostsPopUp
                showPopup={showPopup}
                deleteClick={deleteClick}
                closePopup={closePopup}
                parseTitle={parseTitle}
                inspectPost={inspectPost}
            />

            <Overlay onClick={toggleOverlay} showOverlay={showOverlay}></Overlay>

        </main>
    )
}