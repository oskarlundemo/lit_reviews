


import '../../styles/QouteSection.css'


/**
 * This component is used for rendering the quote the author of the review has set as their favorite
 *
 * @param author the author who wrote the quote
 * @param book the book the quote is in
 * @param favoriteQoute the quote itself
 * @returns {JSX.Element}
 * @constructor
 */



export const QouteSection = ({author, book, favoriteQoute}) => {
    return (
        <div className="qoute-section">
            <h2>"{favoriteQoute}"</h2>
            <p>- <span>{book}</span>, {author}</p>
        </div>
    )
}