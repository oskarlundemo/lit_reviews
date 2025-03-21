/**
 *
 *
 * This component is a pop up window in the Activity.jsx page, used for baning or unbaning users from commenting
 *
 *
 * @param showPopup Toggle pop up state
 * @param onClick Close pop up
 * @param inspectUserComment This is the comment we inspect
 * @param bannedUsers List of all the banned users
 * @param predicate
 * @param unBan Function to unban the user
 * @param ban Function to ban the user
 * @returns {JSX.Element}
 * @constructor
 */



export const ActivityPopUp = ({ showPopup, onClick, inspectUserComment, bannedUsers, predicate, unBan, ban }) => {
    return (
        <div className={`popup-module ${showPopup ? "show" : ""}`}>
            <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                 width="24px" fill="#000000">
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>

            {/* For each numberOfPages, create an index to display them */}

            {inspectUserComment ? (

                // Filter the list of banned users and se if the user of the comment is banned
                bannedUsers && bannedUsers.some(predicate) ? (
                    <>
                        {/* If they are banned, do you want to unban?*/}
                        <h2>Do you want to unban <span>{inspectUserComment.username} </span></h2>
                        <div className="button-container">
                            <button onClick={onClick}>Cancel</button>
                            <button onClick={unBan}>Unban</button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* If they are not banned, do you want to ban?*/}
                        <h2>Do you want to ban <span>{inspectUserComment.username} </span></h2>
                        <div className="button-container">
                            <button onClick={onClick}>Cancel</button>
                            <button onClick={ban}>Ban</button>
                        </div>
                    </>
                )
            ) : (
                <p>Loading user..</p>
            )}
        </div>
    );
};