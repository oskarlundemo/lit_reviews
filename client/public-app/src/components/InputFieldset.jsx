


export const InputFieldset = ({ title, type, id, name, onChange, value, example}) => {
    return (
        <fieldset className="input-fieldset">
            <legend>{title}</legend>
            <div className="input-card author-input">
                <input
                    type={type}
                    id={id}
                    name={name}
                    onChange={onChange}
                    value={value}
                    placeholder={example}
                />
            </div>
        </fieldset>
    );
};