


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



export const WriteBookReview = () => {

    const initialBodyData = '';
    const [editorContent, setEditorContent] = useState(initialBodyData);
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();
    const [publish, setPublished] = useState(true);
    const [thumbnail, setThumbnail] = useState(null);
    const [bookCategories, setBookCategories] = useState([]);
    const [category, setCategory] = useState('');


    const [errors, setErrors] = useState([]);

    const location = useLocation();
    const {post} = location.state || {}

    const [formData, setFormData] = useState({
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


    useEffect(() => {
        if (post) {
            setBookCategories(post.Book.BookCategory.map(c => c.category.category));
            setEditorContent(formData.body);
        }
    }, [post]);


    const handleTextChange = (e) => {
        setCategory(e.target.value);
    }


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (category.trim() !== "" && bookCategories.length < 5) {

                setBookCategories(prev => [
                    ...prev,
                    category.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
                    ]);
                setCategory("");
            }
        }
    };

    const handleEditorChange = (content) => {
        setEditorContent(content);
        setFormData((prevData) => ({
            ...prevData,
            body: content
        }));
    };




    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setThumbnail(selectedFile);
        setFormData((prevData) => ({
            ...prevData,
            thumbnail: selectedFile
        }));
    };

    const handleRadio = (e) => {
        const newPublishState = e.target.id === 'publish';
        setPublished(newPublishState);
        setFormData((prevData) => ({
            ...prevData,
            publish: newPublishState
        }));

        console.log(newPublishState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

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

    useEffect(() => {
        setIsDisabled(!validateForm());
    }, [formData, thumbnail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = {
            bookTitle: formData.bookTitle,
            bookAuthor: formData.bookAuthor,
            bookPages: formData.bookPages,
            bookAbout: formData.bookAbout,
            publish: formData.publish,
            quote: formData.quote,
            reviewTitle: formData.reviewTitle,
            body: formData.body,
            categories: bookCategories,
        };

        if (formData.reviewId) {
            formPayload.reviewId = formData.reviewId;
            formPayload.authorId = formData.authorId;
            formPayload.bookId = formData.bookId;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch('/api/book-review', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formPayload)
            });

            const result = await response.json()
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
                <h2>Update review</h2>
            ) : (
                <h2>New book review</h2>
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


                            <CategoryInput category={category}
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

                        <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" >Submit</button>                    </div>
                </form>
        </main>
    )
}
