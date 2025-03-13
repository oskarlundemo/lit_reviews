



export const Widget = ({text, count = [], box}) => {

    return (

        <div className={`widget ${box}`}>
            <p>{text}</p>
            <p>{count}</p>
        </div>
    )
}