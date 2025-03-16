import {useEffect, useState} from "react";

export const CategoryBox = ({ setReviews, numberOfReviews, allReviews }) => {
    const [categories, setCategories] = useState([]);
    const [activeBtn, setActiveBtn] = useState(0);



    useEffect(() => {
        fetch('/api/home/categories-top', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                console.log(data);
            })
            .catch(err => console.log(err));
    }, [])

    const filterReviewsByCategory = (categoryId, index) => {
        setActiveBtn(index);
        const filtered = allReviews.filter(review =>
            review.Book?.BookCategory?.some(cat => cat.category_id === categoryId)
        );
        setReviews(filtered);
    };

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
