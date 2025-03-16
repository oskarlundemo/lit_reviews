

export const Widget = ({text, count, box}) => {


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