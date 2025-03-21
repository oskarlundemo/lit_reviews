import {useEffect, useState} from "react";

/**
 * This component is used for entering new categories for a book in a new book review
 * @param errors message from the back-end
 * @param handleTextChange update the state of the input
 * @param handleKeyDown when user hits enter, create a new category
 * @param category current category
 * @param name of the input element
 * @returns {JSX.Element}
 * @constructor
 */



export const CategoryInput = ({errors, handleTextChange, handleKeyDown, category, name}) => {

    // State for error messages
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {

        // If there are any errors matching this path, display them
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