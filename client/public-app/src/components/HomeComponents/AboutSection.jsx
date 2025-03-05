

import '../../styles/AboutSection.css';

export const AboutSection = () => {

    return (
        <section className="about-section">
            <div className="left-container">
                <h2>Welcome to <span>Lundemo's Library</span></h2>
                <div className="divider-stretch"></div>
                <p>Lundemo’s Book Reviews is dedicated to exploring literature from around the world, offering in-depth reviews and thoughtful analysis. With a growing collection of critiques and recommendations, the site helps readers navigate new releases and timeless classics. Stay tuned for exclusive content and discover your next favorite book.</p>
            </div>

            <div className="right-container">
                <img src="/images/books.jpg" alt="Books" />
            </div>

        </section>
    )
}