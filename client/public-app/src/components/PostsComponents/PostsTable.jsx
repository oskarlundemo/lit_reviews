import {Link} from "react-router-dom";
import {PostRowComponent} from "./PostRowComponent.jsx";
import {PageSelector} from "../ActivityComponents/PageSelector.jsx";


/**
 *
 * This component is used for storing all the posts in one single table
 *
 * @param posts all the book reviews / posts
 * @param setPosts update the state of the reviews
 * @param parseTitle
 * @param inspectClick
 * @param numberOfPages
 * @param pagePosts
 * @returns {JSX.Element}
 * @constructor
 */



export const PostsTable = ({posts, setPosts, inspectClick, numberOfPages, pagePosts}) => {

    // Sort posts by id
    const sortById = (e) => {
        setPosts((prev) => {
            return [...prev].sort((a, b) => a.id - b.id)
        })
    }

    // Sort posts by title
    const sortByTitle = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.title.localeCompare(b.title);
            })
        })
    }

    // Sort posts by author
    const sortByAuthor = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.Book.Author.name.localeCompare(b.Book.Author.name);
            })
        })
    }

    // Sort posts by date
    const sortByDate = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.created.localeCompare(b.created);
            })
        })
    }

    // Sort posts by book title
    const sortByBook = () => {
        setPosts((prev) => {
            return [...prev].sort((a,b) => {
                return a.Book.title.localeCompare(b.Book.title);
            })
        })
    }


    return (

        <div className="table-container">
        <table className="posts-table">
            <thead>
                   <tr>
                        <th onClick={()=> sortById()} scope="col">ID</th>
                        <th onClick={()=> sortByTitle()} scope="col">Title</th>
                        <th onClick={()=> sortByBook()} scope="col">Book</th>
                        <th onClick={()=> sortByAuthor()} scope="col">Author</th>
                        <th scope="col">Published</th>
                        <th onClick={()=> sortByDate()} scope="col">Date</th>
                        <th scope="col">Configure</th>
                    </tr>
                    </thead>

                    <tbody>

                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <PostRowComponent
                                key={post.id}
                                post={post}
                                inspectClick={inspectClick}
                            />
                        ))
                    ) : (
                        <tr className="error-row">
                            <td colSpan="7">No posts could be found</td>
                        </tr>
                    )}

                    </tbody>
        </table>

            {numberOfPages > 1 && (
                <PageSelector numberOfPages={numberOfPages} pageComments={pagePosts} setComments={setPosts}/>

            )}
        </div>
    )
}