import {useEffect, useState} from "react";


export const CategoryInput = ({errors, handleTextChange, handleKeyDown, category, name}) => {

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const error = errors.find(error => error.path === name);
        setErrorMessage(error ? error.msg : '');
    }, [errors, name]);

    return (
        <>
        <fieldset className="input-fieldset">
            <legend>Category</legend>
            <div className="input-card author-input">
                <input
                    type="text"
                    id="testCategory"
                    name="testCategory"
                    onChange={handleTextChange}
                    value={category}
                    onKeyDown={handleKeyDown}
                    placeholder="Classic"
                />
            </div>
        </fieldset>

            {errors && (
                <p className="error-msg">{errorMessage}</p>
            )}

            <p className="category-container-info">Press enter to apply the category, you can add up to five categories per book!</p>
        </>
    )
}