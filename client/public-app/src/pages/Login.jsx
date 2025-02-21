import {useEffect, useState} from "react";


import '../styles/Login.css'
import {useAuth} from "../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';



export const Login = () => {

    const [isDisabled, setIsDisabled] = useState(true);
    const [quotes, setQuotes] = useState([])
    const navigate = useNavigate(); // Create navigate function


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
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json();

            if (!response.ok) {
                console.log('Result:', result);
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


            <div className="login-box-left">
                <h2>
                    “The books that the world calls immoral are books that show the world its own shame.”
                </h2>
                <h3>- Oscar Wilde, <span>The Picture of Dorian Grey</span></h3>
            </div>


            <div className="divider"></div>

            <div className="login-box-right">

                <h2>Sign in</h2>
                <form onSubmit={handleSubmit} className="login-box-form">
                    <div className="login-user-input">
                    <fieldset className="input-fieldset">
                        <legend>Username</legend>
                        <div className="input-card">
                            <input type="text"
                                   placeholder="johnDoe"
                                   id="username"
                                   name="username"
                                   onChange={handleInputChange}
                                   value={formData.username}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
                        </div>
                    </fieldset>
                        <p className="error-msg username-error">{loginError}</p>

                    <fieldset className="input-fieldset">
                        <legend>Password</legend>

                        <div className="input-card password-input">
                            <input type="password"
                                   placeholder="********"
                                   id="password"
                                   name="password"
                                   onChange={handleInputChange}
                                   value={formData.password}
                                   onFocus={() => setPasswordFocused(true)}
                                   onBlur={() => setPasswordFocused(false)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>
                        </div>
                    </fieldset>
                    </div>

                    <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Sign In</button>
                </form>


            </div>
        </main>
    )
}