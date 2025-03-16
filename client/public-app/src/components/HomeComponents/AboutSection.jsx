

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
                    <p>Lite Reviews is your go-to destination for quick, insightful book reviews. We explore literature from around the world, offering concise critiques and recommendations to help you discover your next great read. From new releases to timeless classics, Lite Reviews provides thoughtful analysis to guide your reading journey.</p>
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
