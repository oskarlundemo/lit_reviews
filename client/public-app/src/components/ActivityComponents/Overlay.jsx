/**
 * This component is used to display an overlay behind the popup modules, ex ActivityPopUp.jsx
 * @param toggleOverlay state to toggle the overlay
 * @param showOverlay function to toggle the overlay
 * @returns {JSX.Element}
 * @constructor
 */


export const Overlay = ({toggleOverlay, showOverlay}) => {
    return (
        <div onClick={toggleOverlay}
             className={`overlay ${showOverlay ? 'active' : ''}`}>
        </div>
    )
}