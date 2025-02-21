import {AboutSection} from "../components/AboutSection.jsx";
import {LatestReviews} from "../components/LatestReviews.jsx";
import {Footer} from "../components/Footer.jsx";
import '../styles/Home.css'


export default function Home  () {


    return (
        <main className="home-container">
            <AboutSection/>
            <LatestReviews/>
            <Footer/>
        </main>
    )
}