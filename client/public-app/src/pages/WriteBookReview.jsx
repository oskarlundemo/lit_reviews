

import { Editor } from '@tinymce/tinymce-react';
import {useContext, useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';



import '../styles/WriteBookReview.css'
import {InputFieldset} from "../components/InputFieldset.jsx";



export const WriteBookReview = () => {

    const [editorContent, setEditorContent] = useState('Hello, World!');
    const [isDisabled, setIsDisabled] = useState(true);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        bookTitle: '',
        bookAuthor: '',
        bookPages: '',

        quote: '',
        reviewTitle: '',
        body: editorContent
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: value
            };
            setIsDisabled(!(updatedData.bookTitle && updatedData.bookAuthor && updatedData.bookPages && updatedData.reviewTitle))
            return updatedData;
        });
    };


    const handleEditorChange = (content) => {
        setEditorContent(content);
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                body: content
            };
            return updatedData;
        })
    };

    const validateForm = () => {
        const { bookTitle, bookAuthor, bookPages, body, reviewTitle } = formData;
        return bookTitle && bookAuthor && reviewTitle && bookPages > 0 && body;
    };

    const isFormValid = validateForm();
    const handleButtonState = () => {
        setIsDisabled(!isFormValid);
    };

    useEffect(() => {
        handleButtonState();
    }, [formData])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const token = localStorage.getItem("token");
            const response = await fetch('/book-review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json();

            if (!result.ok) {

            }

            navigate('/dashboard');

        } catch (err) {
            console.err(err);
        }
    }


    return (
        <main className="book-review">
            <h2>New book review</h2>
                <form onSubmit={handleSubmit} className="book-review-form">
                    <div className="book-info-container">

                        <div className="book-info-area">
                            <h2>Book</h2>
                            <InputFieldset
                                title="Title"
                                type="text"
                                id="bookTitle"
                                name="bookTitle"
                                onChange={handleInputChange}
                                value={formData.bookTitle}
                                example="Dorian Grey"
                            />

                            <InputFieldset
                                title="Author"
                                type="text"
                                id="bookAuthor"
                                name="bookAuthor"
                                onChange={handleInputChange}
                                value={formData.bookAuthor}
                                example="Oscar Wilde"
                            />

                            <InputFieldset
                                title="Pages"
                                type="text"
                                id="pages"
                                name="bookPages"
                                onChange={handleInputChange}
                                value={formData.bookPages}
                                example="250"
                            />

                        </div>

                        <div className="review-info-area">
                            <h2>Review</h2>
                            <InputFieldset
                                title="Title"
                                type="text"
                                id="reviewTitle"
                                name="reviewTitle"
                                onChange={handleInputChange}
                                value={formData.reviewTitle}
                                example="My review of Oscar Wilde´s Dorian Grey"
                            />

                            <InputFieldset
                                title="Quoute"
                                type="text"
                                id="quote"
                                name="quote"
                                onChange={handleInputChange}
                                value={formData.quote}
                                example="I don't want to be at the mercy of my emotions. I want to use them, to enjoy them, and to dominate them."
                            />

                            <InputFieldset
                                title="Thumbnail"
                                type="file"
                                id="thumbnail"
                                name="thumbnail"

                            />

                            <Editor
                                apiKey="tum57p1u5yo358iiwkpwhvq4cnhq24j0k7pfx4vs7jdt23wo"
                                className="text-editor"
                                value={editorContent}
                                init={{
                                    height: 600,
                                    width: '100%',
                                    menubar: false,
                                    plugins: 'link image code',
                                    toolbar: 'undo redo | formatselect | bold italic | link image | code',
                                }}
                                onEditorChange={handleEditorChange}
                            />

                        </div>



                        <button className={`${isDisabled ? 'disabled' : ''}`} type="submit" disabled={isDisabled}>Publish</button>
                    </div>
                </form>
        </main>
    )
}