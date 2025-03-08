

import '../../styles/AboutSection.css';

export const AboutSection = () => {

    return (
        <section className="about-section">
            <div className="left-container">
                <h2>Welcome to <span>Lit reviews</span></h2>
                <div className="divider-stretch"></div>
                <p>Lite Reviews is your go-to destination for quick, insightful book reviews. We explore literature from around the world, offering concise critiques and recommendations to help you discover your next great read. From new releases to timeless classics, Lite Reviews provides thoughtful analysis to guide your reading journey.</p>
            </div>

            <div className="right-container">
                <img src="/images/books.jpg" alt="Books" />
            </div>

        </section>
    )
}