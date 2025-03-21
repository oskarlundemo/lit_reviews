/**
 * This component is used for adding and displaying the categories of books
 * @param categories for the books
 * @param setCategories state to set the categories
 * @returns {JSX.Element}
 * @constructor
 */





export const CategoryContainer = ({categories, setCategories}) => {

    // If users click remove category, remove it from the list
    const deleteCategory = (id) => {
        setCategories(prevCategories => prevCategories.filter((_, index) => index !== id));
    }

    return (
        <div className="category-container">
            {categories.length > 0 && (
                categories.map((category, index) => (
                    <button type="button" key={index}>{category}  <svg onClick={() => deleteCategory(index)} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
                ))
            )}
        </div>
    )
}