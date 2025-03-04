import { createClient } from '@supabase/supabase-js';
import mime from 'mime-types';
import res from "express/lib/response.js";

const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_ANON_URL;
const supabase = createClient(supabaseUrl, supabaseKey)

export const saveFile = async (req, res) => {

    const filePath = `books/${req.file.originalname}`;
    const fileMimeType = req.file.mimetype;

    try {
        const fileBlob = new Blob([req.file.buffer], { type: fileMimeType });

        const {data, error} = await supabase
            .storage
            .from('library')
            .upload(filePath, fileBlob, {
                contentType: fileMimeType,
                cacheControl: '3600',
                upsert: true,
            })

        if (error) {
            console.error("Error:", error.message);
        }

    } catch (err) {
        console.error('Error uploading file:', err.message);
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
}

export const downloadFileFromDB = async (req, res) => {
    try {
        const filePath = `books/test.jpg`;
        const { data, error } = await supabase
            .storage
            .from('library')
            .download(filePath);

        if (error) {
            console.error('Error downloading file:', error.message);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileExtension = filePath.split('.').pop();
        const contentType = mime.lookup(fileExtension) || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);


    } catch (e) {
        console.error('Server error:', e);
        res.status(500).json({ error: e.message });
    }
}


export const deleteImageFromDb = async (filepath) => {
    try {
        const {data, error} = await supabase
            .storage
            .from('library')
            .remove([filepath]);
        if (error) {
            console.error('Error deleting image:', error.message);
        }
        if (!data) {
            return res.status(404).json({ error: 'Image not found' });
        }
        res.status(200).json({message: 'Image deleted'});
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ error: err.message });
    }
}