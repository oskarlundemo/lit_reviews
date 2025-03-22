/**
 * This component is used for the "bento" layout in the AboutSection.jsx
 *
 * @param text for the widget
 * @param count ex number of reviews or number of categories
 * @param box classname for styling
 * @returns {JSX.Element}
 * @constructor
 */



export const Widget = ({text, count, box}) => {

    // Parse the count to ex + 10 instead of 12
    const parseCount = (count) => {
        if (count < 10) {
            return count;
        } else {
            return '+' + (count - (count % 5));
        }
    }

    return (
        <div className={`widget ${box}`}>
            <h3>{text}</h3>
            <h3>{parseCount(count)}</h3>
        </div>
    )
}