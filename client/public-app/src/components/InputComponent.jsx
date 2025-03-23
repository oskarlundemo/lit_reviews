import {useEffect, useState} from "react";
import error from "eslint-plugin-react/lib/util/error.js";

/**
 * This is the default input component used when asking for user data, used in the Login.jsx and WriteBookReview.jsx pages
 * and everywhere else
 *
 * @param title the title for the fieldset
 * @param type type of input ex text or password
 * @param id to identify each input filed
 * @param name name of the input field
 * @param onChange update state of input
 * @param value of the input field
 * @param example placeholder in the field
 * @param errors list of errors
 * @returns {JSX.Element}
 * @constructor
 */



export const InputComponent = ({ title, type, id, name, onChange, value, example, svg = null,  errors = [], onFocus = null, onBlur = null, }) => {
    const [errorMessage, setErrorMessage] = useState(''); // Set error message


    useEffect(() => {
        if (Array.isArray(errors)) {
            const error = errors.find(err => err.path === name);
            setErrorMessage(error ? error.msg : '');
        } else if (typeof errors === 'string') {
            setErrorMessage(errors);
        }
    }, [errors, name]);

    return (
        <>
            <fieldset className="input-fieldset">
                <legend>{title}</legend>
                <div className="input-card author-input">
                    <input
                        type={type}
                        id={id}
                        name={name}
                        onChange={onChange}
                        value={value}
                        placeholder={example}
                        onFocus={onFocus ? onFocus : undefined}
                        onBlur={onBlur ? onBlur : undefined}
                    />

                    {svg && (
                        <div className="input-icon">
                            {Array.isArray(svg) ? svg.map((icon, index) => <span key={index}>{icon}</span>) : <span>{svg}</span>}
                        </div>
                    )}
                </div>
            </fieldset>
            <p className="error-msg">{errorMessage}</p>
        </>
    );
};
