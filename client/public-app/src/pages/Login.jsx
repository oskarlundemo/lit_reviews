import {useEffect, useState} from "react";


import '../styles/Login.css'
import {useAuth} from "../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import {LoginBox} from "../components/LoginComponents/LoginBox.jsx";
import {QuoteBox} from "../components/LoginComponents/QuoteBox.jsx";


export const Login = () => {

    const [isDisabled, setIsDisabled] = useState(true);
    const [quotes, setQuotes] = useState({})
    const navigate = useNavigate();
    const [randomQuote, setRandomQuote] = useState(0);

    useEffect(() => {
        fetch("/api/login", {
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


    const { login } = useAuth();
    const [loginError, setLoginError] = useState(null);


    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoginError(null);
        setIsDisabled(false);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json();

            if (!response.ok) {
                if (result.error.includes('username') || result.error.includes('password')) {
                    setLoginError(result.error)
                } else {
                    throw new Error(result.error || 'Something went wrong');
                }
                return;
            }
            login(result.token);
            navigate('/');
        } catch (err) {
            console.error('Error during login', err);
        }
    }


    return (
        <main className="login-box">

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

        </main>
    )
}