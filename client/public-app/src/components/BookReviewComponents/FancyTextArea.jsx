import {Editor} from "@tinymce/tinymce-react";
import {useEffect, useState} from "react";


export const FancyTextArea = ({errors, name, editorContent, handleEditorChange}) => {

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const error = errors.find(error => error.path === name);
        setErrorMessage(error ? error.msg : '')
    }, [errors]);

    return (
        <>
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
                content_style: ` body {background-color: ${getComputedStyle(document.documentElement).getPropertyValue('--background-color')};   
                color: ${getComputedStyle(document.documentElement).getPropertyValue('--text-color')}; }`
            }}
            onEditorChange={handleEditorChange}
        />
        <p className="error-msg">{errorMessage}</p>
        </>
    )
}