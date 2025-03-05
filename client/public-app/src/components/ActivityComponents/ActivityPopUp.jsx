





export const ActivityPopUp = ({ showPopup, onClick, inspectUserComment, bannedUsers, predicate, onClick1, onClick2 }) => {
    return (
        <div className={`popup-module ${showPopup ? "show" : ""}`}>
            <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                 width="24px" fill="#000000">
                <path
                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>

            {inspectUserComment ? (
                bannedUsers && bannedUsers.some(predicate) ? (
                    <>
                        <h2>Do you want to unban <span>{inspectUserComment.username} </span></h2>
                        <div className="button-container">
                            <button onClick={onClick}>Cancel</button>
                            <button onClick={onClick1}>Unban</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Do you want to ban <span>{inspectUserComment.username} </span></h2>
                        <div className="button-container">
                            <button onClick={onClick}>Cancel</button>
                            <button onClick={onClick2}>Ban</button>
                        </div>
                    </>
                )
            ) : (
                <p>Loading user..</p>
            )}
        </div>
    );
};