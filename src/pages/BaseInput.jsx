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
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Email Input", "mos-faqs")}</h4>
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
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">@</span>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={settingData?.base_input?.email_input}
                                    onChange={(e) => handleChange('base_input.email_input', e.target.value)}
                                />
                            </div>                            
                        </div>
                    }
                </div>
            </div>
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Color Input", "mos-faqs")}</h4>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '70%'}}></div>
                            : <p>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-faqs")}</p>
                        }
                    </div>    
                    {
                        !settingLoading &&                               
                        <div className="col-auto">
                            <input 
                                className="form-control"
                                type="color"
                                value={settingData?.base_input?.color_input}
                                onChange={(e) => handleChange('base_input.color_input', e.target.value)}
                            />                          
                        </div>
                    }
                </div>
            </div>
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Date Input", "mos-faqs")}</h4>
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
                                type="date"
                                value={settingData?.base_input?.date_input}
                                onChange={(e) => handleChange('base_input.date_input', e.target.value)}
                            />                          
                        </div>
                    }
                </div>
            </div>
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Datetime Local Input", "mos-faqs")}</h4>
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
                                type="datetime-local"
                                value={settingData?.base_input?.datetime_local_input}
                                onChange={(e) => handleChange('base_input.datetime_local_input', e.target.value)}
                            />                          
                        </div>
                    }
                </div>
            </div>
			<div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Textarea Input", "mos-faqs")}</h4>
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
                            <textarea 
                                className="form-control"
                                value={settingData?.base_input?.textarea_input}
                                onChange={(e) => handleChange('base_input.textarea_input', e.target.value)}
                            />                          
                        </div>
                    }
                </div>
            </div>
			<div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Switch Input", "mos-faqs")}</h4>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '70%'}}></div>
                            : <p>{__("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus, odio.", "mos-faqs")}</p>
                        }
                    </div>    
                    {
                        !settingLoading &&                               
                        <div className="col-auto">
							<Switch 
								name="base_input.switch_input"
								checked={settingData?.base_input.switch_input} // Pass "1"/"0" from API 
								onChange={handleChange} 
							/>
						</div>
                    }
                </div>
            </div>
        </>
    )
}
export default withForm(BaseInput);