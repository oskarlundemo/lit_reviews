/**
 * This component is used for displaying random quotes in the Login.jsx page
 * @param quotes the quotes
 * @param randomQuote index of the randomly selected quote in the quotes array
 * @returns {JSX.Element}
 * @constructor
 */


export const QuoteBox = ({quotes, randomQuote}) => {

    return (
        <div className="login-box-left">
            {quotes && quotes.length > 0 ? (
                <>
                    {/*Display random index in the array of quotes*/}
                    <h2>"{quotes[randomQuote].favoriteQuote}"</h2>
                    <h3>- <span>{quotes[randomQuote].Book.title}</span>, {quotes[randomQuote].Book.Author.name}</h3>
                </>
            ) : (
                <>
                    <p>Error loading quote...</p>
                </>
            )}
        </div>
    )
}