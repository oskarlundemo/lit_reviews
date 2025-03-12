import {InputComponent} from "../components/InputComponent.jsx";
import {useEffect, useState} from "react";


import '../styles/Posts.css'
import {Link} from "react-router-dom";
import {PostsPopUp} from "../components/PostsComponents/PostsPopUp.jsx";
import {Overlay} from "../components/ActivityComponents/Overlay.jsx";
import {PostsTable} from "../components/PostsComponents/PostsTable.jsx";

export const Posts = () => {


    const [posts, setPosts] = useState([])
    const [inspectPost, setInspectPost] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [pagePosts, setPagePosts] = useState([[]]);


    const [formData, setFormData] = useState({
        search: "",
    });

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

    const postsIntoPages = (posts, postsPerPage = 10) => {
        const pages = [];
        for (let i = 0; i < posts.length; i += postsPerPage) {
            const page = posts.slice(i, i + postsPerPage);
            pages.push(page);
        }
        return pages;
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("/api/posts", {
            method: "GET",
                headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const pages = postsIntoPages(data, 10);
                setNumberOfPages(pages.length);
                setPagePosts(pages);
            })
            .catch(err => console.log(err));
    }, [])


    useEffect(() => {
        if (pagePosts.length > 0) {
            setPosts(pagePosts[0]);
        }
    }, [pagePosts]);


    const parseTitle = (title) => {
        if (title && title.length > 40) {
            let splitTitle = title.substring(0, 40);
            let lastSpace = splitTitle.lastIndexOf(" ");
            return title.substring(0, lastSpace) + ' ...';
        } else
            return title;
    }

    const closePopup = () => {
        setShowPopup(false);
        setShowOverlay(false)
    }

    const inspectClick = (postId) => {
        const token  = localStorage.getItem("token");
        setShowPopup(true);
        setShowOverlay(true);

        fetch(`/api/posts/${postId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {setInspectPost(data)})
            .catch(err => console.log(err));
    }


    const handleSubmitSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')
        fetch(`/api/posts/search?query=${encodeURIComponent(formData.search)}`, {
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


    // Fix so it updates automatically if (res) fetch review again


    const deleteClick = (postId) => {
        const token  = localStorage.getItem("token");
        fetch(`/api/posts/${postId}`, {
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

    const toggleOverlay = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowOverlay(false);
            setShowPopup(false);
        }
    }


    console.log(posts)



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