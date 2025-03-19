

import '../../styles/AboutSection.css';
import {QuoteSlider} from "./QuoteSlider.jsx";
import {Widget} from "./Widget.jsx";
import {useEffect, useState} from "react";

export const AboutSection = ({numberOfReviews}) => {


    const [numberOfCategories, setNumberOfCategories] = useState(0);



    useEffect(() => {
        fetch('api/home/categories/number', {
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
