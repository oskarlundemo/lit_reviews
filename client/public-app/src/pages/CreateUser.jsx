

import '../styles/CreateUser.css';
import {useState} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../context/AuthContext.jsx";
import {InputComponent} from "../components/InputComponent.jsx";
import {PasswordRequirementContainer} from "../components/CreateUserComponents/PasswordRequirementContainer.jsx";




/**
 *
 * CreateUser component is the page where users can sign up for this service
 *
 * @returns {JSX.Element}
 */




export default function CreateUser() {


    const [isPasswordFocused, setPasswordFocused] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

    const [isPasswordLength, setIsPasswordLength] = useState(false);
    const [isNumber, setIsNumber] = useState(false);
    const [isSymbol, setIsSymbol] = useState(false);

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development


    const [inputError, setInputError] = useState([]);
    const { login } = useAuth(); // Login context


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

        setInputError(null);
        setIsDisabled(false);

        try {
            const response = await fetch(`${API_BASE_URL}/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors && result.errors.length > 0) {
                    setInputError(result.errors);
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
                <h2 className="box-header">Sign up</h2>
                <h3 className="box-subheader">Let's get started with your account!</h3>

                <InputComponent
                    title="Username"
                    type="text"
                    name="username"
                    id="username"
                    onChange={handleInputChange}
                    value={formData.username}
                    errors={inputError || []}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>}
                    example='johnDoe'
                />

                <InputComponent
                    title="E-mail"
                    type="mail"
                    name="email"
                    id="email"
                    onChange={handleInputChange}
                    value={formData.email}
                    errors={inputError || []}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z"/></svg>}
                    example='johnDoe@domain.com'
                />


                <InputComponent
                    title="Password"
                    type="password"
                    name="password"
                    id="password"
                    onChange={handleInputChange}
                    value={formData.password}
                    errors={inputError || []}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>}
                    example='******'
                />

                <PasswordRequirementContainer
                    isPasswordFocused={isPasswordFocused}
                    isPasswordLength={isPasswordLength}
                    isNumber={isNumber}
                    isSymbol={isSymbol}
                />

                <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Sign Up</button>
                <p>Already have an account? <Link to="/login">Log in</Link></p>
            </form>
        </main>
    )
}
