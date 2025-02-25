import {useEffect, useState} from "react";
import {Link} from "react-router-dom";


import '../styles/Activity.css'
import {InputFieldset} from "../components/InputFieldset.jsx";


export const Activity = () => {

    const [comments, setComments] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("/api/comments", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => setComments(data))
            .catch(err => console.log(err))
    }, [])



    const handleChange = (e) => {
        const value = e.target.value;
        setSearchQuery(prev => value);
    }


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


    return (
        <main className="activity-container">


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

                {comments.length > 0 || comments ? (
                    <table>
                        <thead>
                        <tr>
                            <th onClick={()=> sortById()} scope="col">ID</th>
                            <th onClick={()=> sortByTitle()} scope="col">Username</th>
                            <th onClick={()=> sortByBook()}scope="col">Comment</th>
                            <th onClick={()=> sortByAuthor()}scope="col">Date</th>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M791-55 686-160H160v-112q0-34 17.5-62.5T224-378q45-23 91.5-37t94.5-21L55-791l57-57 736 736-57 57ZM240-240h366L486-360h-6q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm496-138q29 14 46 42.5t18 61.5L666-408q18 7 35.5 14t34.5 16ZM568-506l-59-59q23-9 37-29.5t14-45.5q0-33-23.5-56.5T480-720q-25 0-45.5 14T405-669l-59-59q23-34 58-53t76-19q66 0 113 47t47 113q0 41-19 76t-53 58Zm38 266H240h366ZM457-617Z"/></svg>                                        <svg onClick={() => inspectClick(post.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                ) : (
                    <p>Loading comments...</p>
                )}


            </section>



        </main>
    )
}