/**
 *
 * This component is used for logging in at the Login.jsx page
 *
 * @param handleSubmit function to handle submit
 * @param handleInputChange function to update state in input
 * @param passwordValue value of the user input
 * @param usernameValue value of the password input
 * @param loginError error message from backend
 * @param isDisabled disable button state
 * @returns {JSX.Element}
 * @constructor
 */
import {InputComponent} from "../InputComponent.jsx";


export const LoginBox = ({handleSubmit, handleInputChange, passwordValue, usernameValue,  loginError, isDisabled}) => {




    return (
        <div className="login-box-right">

            <h2 className="box-header">Sign in</h2>
            <h3 className="box-subheader">Login in and continue were you left off!</h3>
            <form onSubmit={handleSubmit} className="login-box-form">
                <div className="login-user-input">

                    <InputComponent
                        type="text"
                        title="Username"
                        example="johnDoe"
                        id="username"
                        name="username"
                        onChange={handleInputChange}
                        value={usernameValue}
                        errors={loginError}
                        svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>}
                    />

                    <InputComponent
                        title="Password"
                        type="password"
                        name="password"
                        id="password"
                        onChange={handleInputChange}
                        value={passwordValue}
                        example='********'
                        svg={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M80-200v-80h800v80H80Zm46-242-52-30 34-60H40v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Zm320 0-52-30 34-60h-68v-60h68l-34-58 52-30 34 58 34-58 52 30-34 58h68v60h-68l34 60-52 30-34-60-34 60Z"/></svg>
                        }
                    />

                </div>
                {/*If the field are null or empty, do not allow submit*/}
                <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Sign In</button>
            </form>
        </div>
    )
}