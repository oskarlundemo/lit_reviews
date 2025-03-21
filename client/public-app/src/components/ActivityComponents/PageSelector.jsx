


/**
 * This component is used for parsing all the comments in the TableOfUsers into clickable pages
 *  instead of scrolling
 *
 *
 * @param numberOfPages the number of pages filled with comments from users
 * @param setComments used to toggle the current page the user want to see
 * @param pageComment all the comments of the current page
 */


import '../../styles/PageSelector.css'

export const PageSelector = ({numberOfPages, setComments, pageComments}) => {


    // If user clicks on another index, update the comments to that index
    const changePage = (page) => {
        setComments(pageComments[page]);
    }

    return (
        <ul className="page-selector">
            {/* For each numberOfPages, create an index to display them */}
            {Array.from({ length: numberOfPages }, (_, index) => (
                <li onClick={() => changePage(index)} key={index}>{index + 1}</li>
            ))}
        </ul>
    )
}