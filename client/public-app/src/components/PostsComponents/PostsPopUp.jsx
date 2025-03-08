




export const PostsPopUp = ({showPopup, inspectPost, closePopup, deleteClick, parseTitle}) => {

    return (
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
    )
}