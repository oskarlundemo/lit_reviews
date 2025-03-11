import {useEffect, useState} from "react";

import {useNavigate} from "react-router-dom";

import '../../styles/QuoteSlider.css'

export const QuoteSlider = ({slides}) => {


    const [quotes, setQuotes] = useState([]);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuote, setCurrentQuote] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();
    const [animateClass, setAnimateClass] = useState('');




    useEffect(() => {
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



    useEffect(() => {
        setCurrentQuote(quotes[currentIndex]);
    }, [currentIndex] );


    useEffect(() => {
        setAnimateClass('animate');
    }, [currentQuote]);

    const handleAnimationEnd = () => {
        setAnimateClass('');
        setIsAnimating(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [quotes]);



    const handleIndexChange = (index) => {
        setIsAnimating(false);
        setCurrentIndex(index);
        setIsAnimating(true);
    }


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
                            <h2>"{quotes[currentIndex].favouriteQuoute}"</h2>
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