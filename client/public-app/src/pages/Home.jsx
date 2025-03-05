import {AboutSection} from "../components/HomeComponents/AboutSection.jsx";
import {LatestReviews} from "../components/HomeComponents/LatestReviews.jsx";
import {Footer} from "../components/HomeComponents/Footer.jsx";
import '../styles/Home.css'
import {AllBookReviews} from "../components/HomeComponents/AllBookReviews.jsx";


export default function Home  () {

    return (
        <main className="home-container">
            <AboutSection/>
            <LatestReviews/>
            <AllBookReviews/>
            <Footer/>
        </main>
    )
}