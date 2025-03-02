import {useEffect, useState} from "react";


export const ImageComponent = ({ fileName }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`/api/home/image`);
                if (!response.ok) {
                    throw new Error('Image not found');
                }
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImageSrc(imageObjectURL);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();

        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [fileName]);

    if (!imageSrc) {
        return <div>Loading...</div>;
    }
    return <img src={imageSrc} alt={fileName} />;
};
