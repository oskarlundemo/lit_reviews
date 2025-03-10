


export const CategoryInput = ({handleTextChange, handleKeyDown, category}) => {


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
            <p>Press enter to apply the category, you can add up to five categories per book!</p>
        </>
    )
}