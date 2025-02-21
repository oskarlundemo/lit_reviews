

import '../styles/CreateUser.css';
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";



export default function CreateUser() {


    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

    const [isPasswordLenght, setIsPasswordLength] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);


    const { login } = useAuth();
    const [usernameError, setUsernameError] = useState(null);
    const [emailError, setEmailError] = useState(null);


    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    })

    const validatePassword = (password) => {
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const hasNumber = /\d/.test(password);
        const isValidLength = password.length >= 8;

        setIsPasswordLength(isValidLength);
        setIsNumber(hasNumber);
        setIsSymbol(hasSpecialChar);

        return isValidLength && hasSpecialChar && hasNumber;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };

            validatePassword(updatedData.password);
            setIsDisabled(!(updatedData.username && validatePassword(updatedData.password) && updatedData.email))
            return updatedData;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setUsernameError(null);
        setEmailError(null)
        setIsDisabled(false);

        try {
            const response = await fetch('/create-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            const result = await response.json();

            if (!response.ok) {
                if (result.error.includes('Username')) {
                    setUsernameError(result.error)
                } else if (result.error.includes('Email')) {
                    setEmailError(result.error)
                } else {
                    throw new Error(result.error || 'Something went wrong');
                }
                return;
            }

            login(result.token);
            navigate('/');
        } catch (err) {
            console.error('Error creating user', err);
        }
    }


    return (
        <main className="create-user">
            <form onSubmit={handleSubmit} className="create-user-form">
                <h2>Sign Up</h2>
                <p>Let's get started with your reading trial</p>
                <div className="create-user-input">
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

                    <p className="error-msg">{usernameError}</p>

                    <fieldset className="input-fieldset">
                        <legend>E-mail</legend>
                        <div className="input-card">
                            <input type="mail"
                                   placeholder="axa@doe.com"
                                   id="email"
                                   name="email"
                                   onChange={handleInputChange}
                                   value={formData.email}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>
                        </div>
                    </fieldset>

                    <p className="error-msg">{emailError}</p>

                    <fieldset className="input-fieldset">
                        <legend>Password</legend>

                        <div className="input-card password-input">
                            <input type="password"
                                   placeholder="********"
                                   id="username"
                                   name="password"
                                   onChange={handleInputChange}
                                   value={formData.password}
                                   onFocus={() => setPasswordFocused(true)}
                                   onBlur={() => setPasswordFocused(false)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>
                        </div>
                    </fieldset>

                    <div className={`password-checks ${isPasswordFocused ? "show" : ""}`}>

                        <div className={`password-check ${isPasswordLenght ? "length" : ""}`}>
                            {isPasswordLenght ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                            <p>At least 8 characters</p>
                        </div>


                        <div className={`password-check ${isNumber ? "special" : ""}`}>
                            {isNumber ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                            <p>Contains a number</p>
                        </div>

                        <div className={`password-check ${isSymbol ? "special" : ""}`}>
                            {isNumber ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
                                : (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>)}
                            <p>Contains a symbol ex. (!@$%&)</p>
                        </div>
                    </div>

                </div>
                <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Sign Up</button>
                <p>Already have an account? <a>Log in</a></p>
            </form>
        </main>
    )
}
