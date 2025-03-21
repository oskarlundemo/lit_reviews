/**
 *
 * This component is used for creating and displaying a card containing a user comment
 *
 * @param comment from user
 * @param handleDelete function to delete the comment
 * @param user the user who wrote the comment
 * @returns {JSX.Element}
 * @constructor
 */



export const CommentCard = ({comment, handleDelete, user}) => {

    return (
        <div key={comment.id} className="comment-card">
            <div className="comment-card-header">
                <p>@{comment.user.username}</p>
                <div>
                    <p>{comment.created.split('T')[0]}</p>


                    {/*The user or the admin should only be able to delete the comment*/}
                    {user && (user.id === comment.user_id || user.admin)  ? (
                        <svg onClick={() => handleDelete(comment.id, comment.user.id)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    ) : null}
                </div>
            </div>

            <div className="comment-card-body">
                <p>{comment.comment}</p>
            </div>
        </div>
    )
}