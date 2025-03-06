


export const PublishedComponent = ({publish, handleRadio}) => {




    return (
        <div className="published-component">
            <div className="archive">
            <label htmlFor="archive-container">Save for later</label>
            <input
                id="archive"
                type="radio"
                name="publish"
                checked={!publish}
                onChange={handleRadio}
            />
            </div>


            <div className="publish-container">
            <label htmlFor="publish">Publish now</label>
            <input
                id="publish"
                type="radio"
                name="publish"
                checked={publish}
                onChange={handleRadio}
            />
            </div>
        </div>
    )
}