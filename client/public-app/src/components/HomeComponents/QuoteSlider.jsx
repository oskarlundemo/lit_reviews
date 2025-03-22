import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../../styles/QuoteSlider.css'


/**
 * This component is displayed in the AboutSection.jsx component, basically
 * it just show the top three quotes from the most liked reviews
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const QuoteSlider = () => {


    const [quotes, setQuotes] = useState([]); // The state for the quotes
    const [error, setError] = useState(null); // Eror messages
    const [currentIndex, setCurrentIndex] = useState(0); // Index for the quote carousel
    const [currentQuote, setCurrentQuote] = useState(null); // State for the current quote in the carousel
    const [isAnimating, setIsAnimating] = useState(false); // Reset the css transition on change
    const navigate = useNavigate(); // Navigate to that book review
    const [animateClass, setAnimateClass] = useState(''); // Reset the css transition on change


    useEffect(() => {
        // Get the three quotes from the top three book reviews
        fetch('/api/home/top-three-quotes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then((data) => {
                setQuotes(data);
                setCurrentQuote(data[currentIndex]);
            })
            .catch((err) => {
                setError(err.message);
                console.log(err);
            });
    }, []);


    // Used for resetting the css animation once the user clicks another page / index
    useEffect(() => {
        setCurrentQuote(quotes[currentIndex]);
    }, [currentIndex] );


    // Apply the css everytime the users clicks on an index
    useEffect(() => {
        setAnimateClass('animate');
    }, [currentQuote]);

    // Apply the css everytime the users clicks on an index
    const handleAnimationEnd = () => {
        setAnimateClass('');
        setIsAnimating(false);
    };

    // Interval to add timer to carousel, so it rotates
    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            // If one the last index, go to first
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [currentIndex, quotes]);


    // Used so when the user changes index, reset animation and change index / carousel
    const handleIndexChange = (index) => {
        setIsAnimating(false);
        setCurrentIndex(index);
        setIsAnimating(true);
    }

    // If the user clicks on a quote, take them to the review
    const inspectReview = (bookTitle, id) => {
        navigate(`/${bookTitle}/${id}`);
    }

    return (
        <>
            <>
                <div className="quote-slider">
                    {currentQuote ? (
                        <div
                            onClick={() => inspectReview(currentQuote.Book.title, currentQuote.id)}
                            className={`active-quote-container ${isAnimating ? 'animate' : ''}`}
                            onAnimationEnd={handleAnimationEnd}

                        >
                            <h2>"{quotes[currentIndex].favoriteQuote}"</h2>
                            <p>- <span>{quotes[currentIndex].Book.title}</span> {quotes[currentIndex].Book.Author.name}</p>
                        </div>
                    ) : (
                        <div className='active-quote-error'>
                            <h2>No quotes could be retrieved</h2>
                        </div>
                    )}
                </div>
            </>


            <div className="quote-slider-button">
                {quotes.length > 0 && (
                    <ul>
                        {quotes.map((quote, index) => {
                            return (
                                <li className={`{}`} onClick={() => handleIndexChange(index)} key={index}>
                                    {currentIndex === index ? (
                                        <svg className='active-circle' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-280q83 0 141.5-58.5T680-480q0-83-58.5-141.5T480-680q-83 0-141.5 58.5T280-480q0 83 58.5 141.5T480-280Zm0 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                    ): (
                                        <svg className='circle-selector' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </>
    )
}