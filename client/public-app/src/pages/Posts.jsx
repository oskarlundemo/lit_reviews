import {InputFieldset} from "../components/InputFieldset.jsx";
import {useEffect, useState} from "react";


import '../styles/Posts.css'
import {Link} from "react-router-dom";

export const Posts = () => {


    const [posts, setPosts] = useState([])
    const [inspectPost, setInspectPost] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [showOverlay, setShowOverlay] = useState(false)

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

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("/api/posts", {
            method: "GET",
                headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {setPosts(data)})
            .catch(err => console.log(err));
    }, [])

    const parseTitle = (title) => {
        if (title && title.length > 40) {
            let splitTitle = title.substring(0, 40);
            let lastSpace = splitTitle.lastIndexOf(" ");
            return title.substring(0, lastSpace) + ' ...';
        }
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
                setPosts(data)
            }))
            .catch(err => console.log(err));
    }


    const deleteClick = (postId) => {
        const token  = localStorage.getItem("token");
        fetch(`/api/posts/${postId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {setPosts(data)})
            .catch(err => console.log(err));

        closePopup();
    }

    const toggleOverlay = (e) => {
        if (e.target.classList.contains('overlay')) {
            setShowOverlay(false);
            setShowPopup(false);
        }
    }

    const sortById = (e) => {
        setPosts((prev) => {
            return [...prev].sort((a, b) => a.id - b.id)
        })
    }

    const sortByTitle = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.title.localeCompare(b.title);
            })
        })
    }

    const sortByAuthor = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.Book.Author.name.localeCompare(b.Book.Author.name);
            })
        })
    }

    const sortByDate = () => {
        setPosts((prev) => {
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
        <main className="posts">

            <div className="posts-search-form">
                <form onSubmit={handleSubmitSearch}>
                    <InputFieldset
                        title="Search for Posts"
                        type="text"
                        name="search"
                        example="Search for Posts"
                        id="search"
                        onChange={handleInputChange}
                        value={formData.search}
                        />
                </form>
            </div>

            <section className="search-result">

                {posts.length > 0 && posts ? (
                    <table>
                        <thead>
                        <tr>
                            <th onClick={()=> sortById()} scope="col">ID</th>
                            <th onClick={()=> sortByTitle()} scope="col">Title</th>
                            <th onClick={()=> sortByBook()}scope="col">Book</th>
                            <th onClick={()=> sortByAuthor()}scope="col">Author</th>
                            <th scope="col">Published</th>
                            <th onClick={()=> sortByDate()} scope="col">Date</th>
                            <th scope="col">Configure</th>
                        </tr>
                        </thead>

                        <tbody>

                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>{parseTitle(post.title)}</td>
                                <td>{post.Book.title}</td>
                                <td>{post.Book.Author.name}</td>
                                {post.published ? (
                                    <td>
                                        <svg className="published" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                    </td>
                                ) : (
                                    <td>
                                        <svg className="not-published" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                    </td>
                                )}
                                <td>{post.created.split('T')[0]}</td>

                                <td>
                                    <div>
                                        <Link to="/book-review" state={{post}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                                        </Link>

                                        <svg onClick={() => inspectClick(post.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                ) : (
                    <p>No results matched...</p>
                )}

            </section>

            <div className={`popup-module ${showPopup ? 'show' : ''}`}>
                <svg onClick={() => closePopup()} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>

                <h2>Are you sure you want to delete?</h2>

                {inspectPost ? (
                    <div className="book-info-container">
                        <p>ID: {inspectPost.id}</p>
                        <p>Title: {parseTitle(inspectPost.title)}</p>
                        <p>Book: {inspectPost.Book.title}</p>
                        <p>Author: {inspectPost.Book.Author.name}</p>
                    </div>

                ) : (
                    <p>Loading...</p>
                )}

                <p className="final-warning">This action <span>can not</span> be undone!</p>

                {inspectPost ? (
                    <div className="button-container">
                        <button onClick={closePopup} >Cancel</button>
                        <button onClick={()=> deleteClick(inspectPost.id)}>Delete</button>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div onClick={toggleOverlay} className={`overlay ${showOverlay ? 'active' : ''}`}></div>

        </main>
    )
}