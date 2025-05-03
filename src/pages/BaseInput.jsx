import { __ } from "@wordpress/i18n";
import React from 'react';
import Switch from '../components/Switch/Switch';
import { useMain } from '../contexts/MainContext';
import withForm from '../pages/withForm';
const BaseInput = ({handleChange}) => {
    const {
        settingData,
        settingLoading
    } = useMain();
    return (
        <>
            <div className="setting-unit">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h2" style={{width: '60%', height: '20px'}}></div>
                            : <h5 className="">{__("Text Input", "mos-faqs")}</h5>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '60%', height: '20px'}}></div>
                            : <p className="">{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-faqs")}</p>
                        }
                    </div>                                    
                    <div className="col-lg-5">
                        <input 
                            className="form-control"
                            type="text"
                            value={settingData?.base_input?.text_input}
                            onChange={(e) => handleChange('base_input.text_input', e.target.value)}
                        />
                    </div>
                </div>
            </div>
            
            <div className="row justify-content-between">
                <div className="col-lg-7">
                    {
                        settingLoading 
                        ? <div className="loading-skeleton" style={{width: '60%', height: '20px'}}></div>
                        : <h5 className="">{__("Text Input", "mos-faqs")}</h5>
                    }
                    {
                        settingLoading 
                        ? <div className="loading-skeleton" style={{width: '60%', height: '20px'}}></div>
                        : <p className="">{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-faqs")}</p>
                    }
                </div>                                    
                <div className="col-auto">
                    <Switch 
                        name="elements.basic.switch"
                        checked={settingData?.elements?.basic?.switch} // Pass "1"/"0" from API 
                        onChange={handleChange} 
                    />
                </div>
            </div>
        </>
    )
}
export default withForm(BaseInput);