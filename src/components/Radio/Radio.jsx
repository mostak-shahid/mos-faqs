import Hint from '../Hint/Hint';
import './Radio.scss';
export default function Radio({ defaultValue, options = [], name = '', type = '', handleChange, hasMedia='0' }) {
    return (
        <div className={`radio-group ${type == 'inline'?"radio-group-inline":"radio-group-block"} ${hasMedia == '1' ? 'has-media' : ''}`}>
            {options.map((option, index) => (
                <div className={`form-check ${option?.hint?'with-hints':'without-hints' }`} key={index}>
                    <input
                        value={option.value}
                        className="form-check-input"
                        type='radio' // Use the `type` prop
                        name={name}
                        id={`${name}-${index}`}
                        checked={defaultValue === option.value}
                        onChange={() => handleChange(name, option.value)}
                        disabled={option?.disabled}
                    />
                    <div className="content">
                        <label className="form-check-label" htmlFor={`${name}-${index}`} dangerouslySetInnerHTML={{ __html: option.label }}/>
                        {
                            option?.hint && 
                            <Hint content={option.hint} />
                        }
                    </div>
                </div>
            ))}
        </div>
    );
}
