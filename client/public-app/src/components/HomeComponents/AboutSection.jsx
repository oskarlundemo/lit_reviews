

import '../../styles/AboutSection.css';
import {QuoteSlider} from "./QuoteSlider.jsx";
import {Widget} from "./Widget.jsx";
import {useEffect, useState} from "react";


/**
 * This component is a section in the homePage.jsx contain info about the latest reviews
 *
 * @param numberOfReviews how man reviews there are on the page
 * @returns {JSX.Element}
 * @constructor
 */


export const AboutSection = ({numberOfReviews}) => {


    const [numberOfCategories, setNumberOfCategories] = useState(0); // Set the number of reviews

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development


    useEffect(() => {
        // Get the number of reviews
        fetch(`${API_BASE_URL}/home/categories/number`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(data => {
                setNumberOfCategories(data);
            })
            .catch(err => console.log(err));

    }, [])



    return (
        <section className="about-section">

            <div className="bento-container">
            <div className="left-container">

                <div className="bento-text-container widget">
                    <h2>Welcome to <span>Lit reviews</span></h2>
                    <div className="divider-stretch"></div>
                    <p>Lit Reviews is my personal space for thoughtful, in-depth book reviews. I explore stories across genres, offering insights without spoilers. Whether you're looking for your next great read or a fresh perspective on a favorite book, Lit Reviews delivers honest, engaging takes on literature.</p>
                </div>

                <Widget  text="Reviews 📚" count={numberOfReviews} box="box-one"/>
                <Widget text="Categories 🗄️" count={numberOfCategories} box='box-two'/>
            </div>

            <div className="right-container widget">
                <QuoteSlider/>
            </div>
            </div>

        </section>
    )
}
