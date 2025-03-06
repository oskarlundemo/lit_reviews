import {useEffect, useState} from "react";


export const InputComponent = ({ title, type, id, name, onChange, value, example, errors = []}) => {
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const error = errors.find(error => error.path === name);
        setErrorMessage(error ? error.msg : '');
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
                    />
                </div>
            </fieldset>
            <p className="error-msg">{errorMessage}</p>
        </>
    );
};
