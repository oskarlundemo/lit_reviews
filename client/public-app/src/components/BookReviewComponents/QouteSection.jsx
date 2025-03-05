


import '../../styles/QouteSection.css'



export const QouteSection = ({author, book, favoriteQoute}) => {


    return (
        <div className="qoute-section">
            <h2>"{favoriteQoute}"</h2>
            <p>- <span>{book}</span>, {author}</p>
        </div>
    )
}