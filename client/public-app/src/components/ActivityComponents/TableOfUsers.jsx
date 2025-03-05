



export const UserTable = ({openPopup, sortDate, onClick: sortId, comments, bannedUsers, deleteComment}) => {
    return <table>
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
                <tr key={comment.id}>
                    <td>{comment.id}</td>
                    <td>{comment.user.username}</td>
                    <td>{comment.comment}</td>
                    <td>{comment.created}</td>
                    <td>
                        <div>
                            {bannedUsers && bannedUsers.some(user => comment.user.id === user.user_id) ? (
                                <svg onClick={() => openPopup(comment.user)}
                                     xmlns="http://www.w3.org/2000/svg" height="24px"
                                     viewBox="0 -960 960 960" width="24px"
                                     fill="#000000">
                                    <path d="M791-55L686-160H160v-112q0-34 17.5-62.5T224-378q45-23 91.5-37t94.5-21L55-791l57-57 736 736-57 57ZM240-240h366L486-360h-6q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm496-138q29 14 46 42.5t18 61.5L666-408q18 7 35.5 14t34.5 16ZM568-506l-59-59q23-9 37-29.5t14-45.5q0-33-23.5-56.5T480-720q-25 0-45.5 14T405-669l-59-59q23-34 58-53t76-19q66 0 113 47t47 113q0 41-19 76t-53 58Zm38 266H240h366ZM457-617Z"/>
                                </svg>
                            ) : (
                                <svg onClick={() => openPopup(comment.user)}
                                     xmlns="http://www.w3.org/2000/svg" height="24px"
                                     viewBox="0 -960 960 960" width="24px"
                                     fill="#000000">
                                    <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/>
                                </svg>
                            )}
                            <svg onClick={() => deleteComment(comment.id)}
                                 xmlns="http://www.w3.org/2000/svg" height="24px"
                                 viewBox="0 -960 960 960" width="24px" fill="#000000">
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                            </svg>
                        </div>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td className="no-comments" colSpan="5"><p>No comments</p></td>
            </tr>
        )}

        </tbody>
    </table>;
}