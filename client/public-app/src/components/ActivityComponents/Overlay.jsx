



export const Overlay = ({toggleOverlay, showOverlay}) => {
    return (
        <div onClick={toggleOverlay}
             className={`overlay ${showOverlay ? 'active' : ''}`}>
        </div>
    )
}