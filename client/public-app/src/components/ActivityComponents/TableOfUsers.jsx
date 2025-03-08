import {useEffect} from "react";
import {TableRowComponent} from "./TableRowComponent.jsx";
import {PageSelector} from "./PageSelector.jsx";


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

            <PageSelector numberOfPages={numberOfPages} pageComments={pageComments} setComments={setComments}/>

        </div>
            )
}