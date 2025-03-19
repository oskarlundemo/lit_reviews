


export const QuoteBox = ({quotes, randomQuote}) => {

    return (
        <div className="login-box-left">
            {quotes && quotes.length > 0 ? (
                <>
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