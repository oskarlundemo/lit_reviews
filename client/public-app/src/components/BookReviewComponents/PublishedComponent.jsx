/**
 * This component is used for contain the elements to either publish a book review now or save it for late
 * @param publish state to update if the review should be published
 * @param handleRadio update the state of the radio buttons
 * @returns {JSX.Element}
 * @constructor
 */



export const PublishedComponent = ({publish, handleRadio}) => {



    return (
        <div className="published-component">


            {/*If you want to archive this post and save it for late*/}
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

            {/*Publish the book review now*/}

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