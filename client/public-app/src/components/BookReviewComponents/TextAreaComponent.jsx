import {useEffect, useState} from "react";


export const TextAreaComponent = ({handleInputChange, errors, name, placeholder, fieldsetName, value}) => {

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const error = errors.find(error => error.path === name);
        setErrorMessage(error ? error.msg : '');
    })

    return (
        <>
            <fieldset className="input-fieldset">
                <legend>{fieldsetName}</legend>
                <div className="input-card author-input">
                    <textarea
                        id={name}
                        name={name}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        value={value}
                    />
                </div>
            </fieldset>
            <p className="error-msg">{errorMessage}</p>
        </>
    )
}
