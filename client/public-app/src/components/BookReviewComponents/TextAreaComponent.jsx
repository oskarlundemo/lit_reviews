import {useEffect, useState} from "react";


export const TextAreaComponent = ({handleInputChange, bookAbout, errors, name, placeholder}) => {

    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        console.log(errors)
        const error = errors.find(error => error.path === name);
        setErrorMessage(error ? error.msg : '');
    })


    return (
        <>
            <fieldset className="input-fieldset">
                <legend>Preview</legend>
                <div className="input-card author-input">
                    <textarea
                        title="Preview" id="bookAbout" name="bookAbout"
                        onChange={handleInputChange} value={bookAbout}
                        placeholder={placeholder}
                    />
                </div>
            </fieldset>
            <p className="error-msg">{errorMessage}</p>
        </>
    )
}
