



export const Widget = ({text, count = [], box}) => {

    return (

        <div className={`widget ${box}`}>
            <h3>{text}</h3>
            <h3>{count}</h3>
        </div>
    )
}