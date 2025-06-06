import {useEffect} from "react";
import {TableRowComponent} from "./TableRowComponent.jsx";
import {PageSelector} from "./PageSelector.jsx";

/**
 * This component is used for displaying all the comments from the users in the app
 *
 *
 * @param openPopup state to toggle the popup module
 * @param sortDate function to sort comments by date
 * @param sortId function to sort comments by id
 * @param comments all the comments
 * @param bannedUsers list of bannedUsers
 * @param deleteComment function to delete a comment
 * @param numberOfPages numberOfPages in the table
 * @param pageComments the current page filled with comments
 * @param setComments update the state of the comments
 * @returns {JSX.Element}
 * @constructor
 */



export const UserTable = ({openPopup, sortDate, onClick: sortId, comments, bannedUsers, deleteComment, numberOfPages, pageComments, setComments}) => {


    return (

        <div className="table-container">

        <table className="activity-table">
        <thead>
        <tr>
            <th onClick={sortId} scope="col">ID</th>
            <th scope="col">Username</th>
            <th scope="col">Comment</th>
            <th onClick={sortDate} scope="col">Date</th>
            <th scope="col">Actions</th>
        </tr>
        </thead>

        <tbody>

        {/*Display each comment and apply all the functions*/}
        {comments.length > 0 ? (
            comments.map((comment) => (
                <TableRowComponent
                    key={comment.id}
                    comment={comment}
                    bannedUsers={bannedUsers}
                    openPopup={openPopup}
                    deleteComment={deleteComment}
                />
            ))
        ) : (
            <tr>
                <td className="no-comments" colSpan="5"><p>No comments</p></td>
            </tr>
        )}

        </tbody>
        </table>

            {/*Used for selecting page of comments, ex 1 2 3 4 5*/}
            <PageSelector numberOfPages={numberOfPages} pageComments={pageComments} setComments={setComments}/>

        </div>
            )
}