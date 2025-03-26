import {useEffect, useState} from "react";


import '../styles/Login.css'
import {useAuth} from "../context/AuthContext.jsx";
import {useNavigate } from 'react-router-dom';
import {LoginBox} from "../components/LoginComponents/LoginBox.jsx";
import {QuoteBox} from "../components/LoginComponents/QuoteBox.jsx";


/**
 * This is the login page in the application
 *
 * @returns {JSX.Element}
 * @constructor
 */



export const Login = () => {

    const [isDisabled, setIsDisabled] = useState(true); // Disable the form
    const [quotes, setQuotes] = useState({}) // Get quotes from books, displayed in the QuoteBox.jsx
    const navigate = useNavigate(); // Use to navigate
    const [randomQuote, setRandomQuote] = useState(0); // Get a random index in the array of quotes
    const [loginError, setLoginError] = useState(null); // Handle error messages
    const { login } = useAuth(); // Login user with authContext

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    useEffect(() => {
        // Fetch the quotes and select a random one
        fetch(`${API_BASE_URL}/sign-in`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setQuotes(data);
                setRandomQuote(Math.floor(Math.random() * data.length));
            })
            .catch(err => console.log(err));
    }, []);



    // Update the state of the login form
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    // Handle input / value change of the input fields in the login form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            setIsDisabled(!(updatedData.username && updatedData.password))
            return updatedData;
        });
    };


    // Handle submit of login form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Set error msg null
        setLoginError(null);
        // Disable button to submit
        setIsDisabled(false);


        try {
            // Send form data to the back-end
            const response = await fetch(`${API_BASE_URL}/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            // If there was an error
            if (!response.ok) {
                if (result.error.includes('username') || result.error.includes('password')) {
                    setLoginError(result.error);
                }
                return;
            }

            // Successful login, send the token and navigate to the homescreen
            login(result.token);
            navigate('/');
        } catch (err) {
            console.error('Error during login', err);
        }
    }


    return (
        <main className="login-box">


            <div className="login-box-wrapper">
            <QuoteBox
                quotes={quotes}
                randomQuote={randomQuote}
            />

            <div className="divider"></div>

            <LoginBox
                handleSubmit={handleSubmit}
                isDisabled={isDisabled}
                loginError={loginError}
                handleInputChange={handleInputChange}
                passwordValue={formData.password}
                usernameValue={formData.username}/>

            </div>
        </main>
    )
}