


import { useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";



import '../styles/WriteBookReview.css'
import {InputComponent} from "../components/InputComponent.jsx";
import {FancyTextArea} from "../components/BookReviewComponents/FancyTextArea.jsx";
import {TextAreaComponent} from "../components/BookReviewComponents/TextAreaComponent.jsx";
import {PublishedComponent} from "../components/BookReviewComponents/PublishedComponent.jsx";
import {CategoryContainer} from "../components/BookReviewComponents/CategoryContainer.jsx";
import {CategoryInput} from "../components/BookReviewComponents/CategoryInput.jsx";


/**
 * This page is used for updating and creating new book reviews
 * @returns {JSX.Element}
 * @constructor
 */



export const WriteBookReview = () => {

    const [editorContent, setEditorContent] = useState(''); // Set text editor to ''
    const [isDisabled, setIsDisabled] = useState(true); // Disable button
    const navigate = useNavigate(); // Navigate to next page
    const [publish, setPublished] = useState(true); // Publish post now or later
    const [thumbnail, setThumbnail] = useState(null); // Thumbnail for the post
    const [bookCategories, setBookCategories] = useState([]); // Categories for the book
    const [category, setCategory] = useState(''); // Set new categories
    const [errors, setErrors] = useState([]); // Validation errors
    const location = useLocation(); // Get data from previous page when updating
    const {post} = location.state || {} // If there is a location.state, then edit review, else create a new one

    const PRODUCTION_URL = import.meta.env.VITE_API_BASE_URL;  // Matches .env variable
    const API_BASE_URL = import.meta.env.PROD
        ? PRODUCTION_URL  // Use backend in production
        : "/api";  // Use Vite proxy in development

    // Used for updating the form data
    const [formData, setFormData] = useState({

        // Basically, if there is a post provided with the location.state, set the field to that value, else ''
        bookTitle: post?.Book.title || '',
        bookAuthor: post?.Book.Author.name || '',
        bookPages: post?.Book.pages || '',
        bookAbout: post?.Book.about || '',

        publish: post?.publish || publish,
        quote: post?.favoriteQuote || '',
        reviewTitle: post?.title || '',
        body: post?.body || editorContent,


        thumbnail: thumbnail,
        reviewId: post?.id || null,
        bookId: post?.Book.id || null,
        authorId: post?.Book.Author.id || null,
        categories: post?.Book.BookCategory?.map(c => c.category.category) || [],
    });

    // Set categories for the book
    useEffect(() => {
        if (post) {
            setBookCategories(post.Book.BookCategory.map(c => c.category.category));
            setEditorContent(formData.body);
        }
    }, [post]);


    // Handle text change for categories
    const handleTextChange = (e) => {
        setCategory(e.target.value);
    }

    // If user clicks enter after writing a category, parse it and add it into to the array
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (category.trim() !== "" && bookCategories.length < 5) {
                setBookCategories(prev => [
                    ...prev,
                    category.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
                    ]);
                // Reset the field so the user can add more categories
                setCategory("");
            }
        }
    };

    // Update text editor changes
    const handleEditorChange = (content) => {
        setEditorContent(content);
        setFormData((prevData) => ({
            ...prevData,
            body: content
        }));
    };

    // Handle file changes
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setThumbnail(selectedFile);
        setFormData((prevData) => ({
            ...prevData,
            thumbnail: selectedFile
        }));
    };

    // Handle radio state
    const handleRadio = (e) => {
        const newPublishState = e.target.id === 'publish';
        setPublished(newPublishState);
        setFormData((prevData) => ({
            ...prevData,
            publish: newPublishState
        }));
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    // Validate form, make sure each field has a value before submitting
    const validateForm = () => {
        const { bookTitle, bookAuthor, bookPages, body, thumbnail, reviewTitle } = formData;

        const updatedPost = post?.reviewId;
        const isThumbnailValid = updatedPost ? true : (thumbnail && thumbnail.size > 0);

        return (
            bookTitle &&
            bookAuthor &&
            reviewTitle &&
            bookPages > 0 &&
            isThumbnailValid &&
            body
        );
    };

    // Update the state of the button if all fields are filled
    useEffect(() => {
        setIsDisabled(!validateForm());
    }, [formData, thumbnail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Append all the data to form
        const formPayload = new FormData();
        formPayload.append("bookTitle", formData.bookTitle);
        formPayload.append("bookAuthor", formData.bookAuthor);
        formPayload.append("bookPages", formData.bookPages);
        formPayload.append("bookAbout", formData.bookAbout);
        formPayload.append("publish", formData.publish);
        formPayload.append("quote", formData.quote);
        formPayload.append("reviewTitle", formData.reviewTitle);
        formPayload.append("body", formData.body);
        formPayload.append("thumbnail", formData.thumbnail);


        bookCategories.forEach((category, index) => {
            formPayload.append(`categories[${index}]`, category);
        });

        // If we are just updating a review, send the id, authorId and bookId
        if (formData.reviewId) {
            formPayload.append("reviewId", formData.reviewId);
            formPayload.append("authorId", formData.authorId);
            formPayload.append("bookId", formData.bookId);
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/book-review`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                body: formPayload
            });

            const result = await response.json();
            if (response.ok) {
                navigate('/dashboard');
            } else if (result.errors.length > 0) {
                setErrors(result.errors);
            }

        } catch (err) {
            console.error('Fetch error:', err);
        }
    };


    return (
        <main className="book-review">
            {post ? (
                <h2 className="review-title">Update review</h2>
            ) : (
                <h2 className="review-title">New book review</h2>
            )}
                <form onSubmit={handleSubmit} className="book-review-form">
                    <div className="book-info-container">

                        <div className="book-info-area">
                            <h2>Book 📚</h2>
                            <InputComponent
                                title="Title"
                                type="text"
                                id="bookTitle"
                                name="bookTitle"
                                onChange={handleInputChange}
                                value={formData.bookTitle}
                                example="Dorian Grey"
                                errors={errors}
                            />

                            <InputComponent
                                title="Author"
                                type="text"
                                id="bookAuthor"
                                name="bookAuthor"
                                onChange={handleInputChange}
                                value={formData.bookAuthor}
                                example="Oscar Wilde"
                                errors={errors}
                            />

                            <TextAreaComponent
                                handleInputChange={handleInputChange}
                                bookTitle={formData.bookAbout}
                                value={formData.bookAbout}
                                name={"bookAbout"}
                                errors={errors}
                                placeholder={'Dorian Gray is a man who trades his soul for eternal youth—but at a terrible cost.'}
                                fieldsetName={"Preview"}
                            />

                            <InputComponent
                                title="Pages"
                                type="text"
                                id="pages"
                                name="bookPages"
                                onChange={handleInputChange}
                                value={formData.bookPages}
                                example="250"
                                errors={errors}
                            />


                            <CategoryInput
                                category={category}
                                handleTextChange={handleTextChange}
                                handleKeyDown={handleKeyDown}
                                errors={errors}
                                name='categories'
                            />

                            <CategoryContainer
                                categories={bookCategories}
                                setCategories={setBookCategories}
                            />

                        </div>

                        <div className="review-info-area">
                            <h2>Review 📝</h2>
                            <InputComponent
                                title="Title"
                                type="text"
                                id="reviewTitle"
                                name="reviewTitle"
                                onChange={handleInputChange}
                                value={formData.reviewTitle}
                                example="My review of Oscar Wilde´s Dorian Grey"
                                errors={errors}
                            />

                            <TextAreaComponent
                                handleInputChange={handleInputChange}
                                bookTitle={formData.quote}
                                value={formData.quote}
                                name={"quote"}
                                errors={errors}
                                placeholder={"I don't want to be at the mercy of my emotions. I want to use them, to enjoy them, and to dominate them"}
                                fieldsetName={"Favorite quote"}
                            />

                            <InputComponent
                                title="Thumbnail"
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                onChange={handleFileChange}
                                accept='image/*'
                                errors={errors}
                            />


                            <FancyTextArea
                                editorContent={editorContent} errors={errors}
                                handleEditorChange={handleEditorChange} name={'body'}
                            />

                            <PublishedComponent
                                publish={publish}
                                handleRadio={handleRadio}
                                />

                        </div>
                        <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" >Submit</button>
                    </div>
                </form>
        </main>
    )
}
