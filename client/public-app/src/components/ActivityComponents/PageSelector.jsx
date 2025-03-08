


import '../../styles/PageSelector.css'

export const PageSelector = ({numberOfPages, setComments, pageComments}) => {

    const changePage = (page) => {
        setComments(pageComments[page]);
    }

    return (
        <ul className="page-selector">
            {Array.from({ length: numberOfPages }, (_, index) => (
                <li onClick={() => changePage(index)} key={index}>{index + 1}</li>
            ))}
        </ul>
    )
}