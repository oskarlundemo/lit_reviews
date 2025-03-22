





export const PasswordRequirementContainer = ({isPasswordFocused, isPasswordLength, isNumber, isSymbol}) => {



    return (
        <div className={`password-checks ${isPasswordFocused ? "show" : ""}`}>

            <div className={`password-check ${isPasswordLength ? "length" : ""}`}>
                {isPasswordLength ? (<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/></svg>)
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
    )
}