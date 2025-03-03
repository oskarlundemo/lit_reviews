import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_ANON_URL;
const supabase = createClient(supabaseUrl, supabaseKey);

export const ImageComponent = ({ fileName }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            const { data, error } = supabase
                .storage
                .from('library')
                .getPublicUrl(`books/${fileName}`);
            if (error) {
                console.error('Error generating public URL:', error.message);
            } else {
                setImageSrc(data.publicUrl);
            }
        };
        fetchImage();
    }, [fileName]);

    if (!imageSrc) {
        return <div>Loading...</div>;
    }

    return <img src={imageSrc} alt={fileName} />;
};
