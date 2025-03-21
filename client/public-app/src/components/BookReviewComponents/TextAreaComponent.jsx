import {useEffect, useState} from "react";


/**
 *
 * This component is used in the WriteBookReview.jsx for adding a favorite quote from a book
 *
 *
 * @param handleInputChange update state
 * @param errors list of errors
 * @param name of the textarea<>
 * @param placeholder placeholder
 * @param fieldsetName text for the fieldset
 * @param value for the textarea
 * @returns {JSX.Element}
 * @constructor
 */






export const TextAreaComponent = ({handleInputChange, errors, name, placeholder, fieldsetName, value}) => {

    // List of errors
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // If there are any errors for this component, display them
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
