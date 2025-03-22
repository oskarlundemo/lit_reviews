import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';


/**
 * This component is used for rendering the thumbnail in the BookCard.jsx
 */

// Get api-keys from .env
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_ANON_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

export const ImageComponent = ({ fileName }) => {
    const [imageSrc, setImageSrc] = useState(null); // Set the src of the img element

    useEffect(() => {
        // Fetch the image from supabase
        const fetchImage = async () => {
            const { data, error } = supabase
                .storage
                // Name of bucket
                .from('library')
                // Path to the thumbnail
                .getPublicUrl(`books/${fileName}`);
            if (error) {
                console.error('Error generating public URL:', error.message);
            } else {
                setImageSrc(data.publicUrl);
            }
        };
        fetchImage();
    }, [fileName]);

    // Loading image from db
    if (!imageSrc) {
        return <div>Loading...</div>;
    }

    // Return thumbnail
    return <img src={imageSrc} alt={fileName} />;
};
