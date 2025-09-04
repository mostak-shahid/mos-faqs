import { __ } from "@wordpress/i18n";
import React from 'react';
import { useMain } from '../contexts/MainContext';
import withForm from './withForm';
const Page = ({handleChange}) => {
    const {
        settingData,
        settingLoading
    } = useMain();
    return (
        <>
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Text Input", "mos-faqs")}</h4>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '70%'}}></div>
                            : <p>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-faqs")}</p>
                        }
                    </div>    
                    {
                        !settingLoading &&                               
                        <div className="col-lg-5">
                            <input 
                                className="form-control"
                                type="text"
                                value={settingData?.base_input?.text_input}
                                onChange={(e) => handleChange('base_input.text_input', e.target.value)}
                            />                          
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default withForm(Page);