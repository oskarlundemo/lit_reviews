

import '../../styles/AboutSection.css';
import {QuoteSlider} from "./QuoteSlider.jsx";
import {Widget} from "./Widget.jsx";

export const AboutSection = () => {


    const slides = [
        { url: '/images/books.jpg' }
    ];


    return (
        <section className="about-section">

            <div className="bento-container">
            <div className="left-container">

                <div className="bento-text-container widget">
                    <h2>Welcome to <span>Lit reviews</span></h2>
                    <div className="divider-stretch"></div>
                    <p>Lite Reviews is your go-to destination for quick, insightful book reviews. We explore literature from around the world, offering concise critiques and recommendations to help you discover your next great read. From new releases to timeless classics, Lite Reviews provides thoughtful analysis to guide your reading journey.</p>
                </div>


                <Widget  text="Reviews 📚" count={10} box="box-one"/>
                <Widget text="Categoires 🗄️" count={10} box='box-two'/>

            </div>

            <div className="right-container widget">
                <QuoteSlider slides={slides} />
            </div>
            </div>


        </section>
    )
}


/**
 *                 <img src="/images/books.jpg" alt="Books" />
 *
 */