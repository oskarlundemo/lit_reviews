import {useEffect, useState} from "react";


/**
 * This component is used to display which categories the book has
 *
 * @param setReviews update the review in AllBookReviews.jsx by category
 * @param numberOfReviews
 * @param allReviews all the book reviews
 * @returns {JSX.Element}
 * @constructor
 */

export const CategoryBox = ({ setReviews, numberOfReviews, allReviews }) => {
    const [categories, setCategories] = useState([]); // Store categories
    const [activeBtn, setActiveBtn] = useState(0); // Used for css styling


    useEffect(() => {
        // Get the top 5 categories from the back end
        fetch('/api/home/categories-top', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
            })
            .catch(err => console.log(err));
    }, [])

    // When the user clicks a button with a category, filter the reviews with that category
    const filterReviewsByCategory = (categoryId, index) => {
        setActiveBtn(index);
        const filtered = allReviews.filter(review =>
            review.Book?.BookCategory?.some(cat => cat.category_id === categoryId)
        );
        setReviews(filtered);
    };

    // When user click the button all, show all reviews (like a reset)
    const showAllReviews = () => {
        setActiveBtn(0);
        setReviews(allReviews);
    }

    return (
        <div className="category-box">
            <button className={activeBtn === 0 ? 'active-btn' : ''} onClick={() => showAllReviews()}>All ({numberOfReviews})</button>
            {categories.length > 0 &&
                categories.map((category, index) => (
                    <button className={activeBtn === index + 1 ? 'active-btn' : ''} onClick={() => filterReviewsByCategory(category.id, index + 1)} key={category.id + 1}>
                        {category.category} ({category.count})
                    </button>
                ))}
        </div>
    )
}
