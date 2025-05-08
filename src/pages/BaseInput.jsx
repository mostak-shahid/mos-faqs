import { __ } from "@wordpress/i18n";
import React from 'react';
import Radio from '../components/Radio/Radio';
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
            {console.log(settingData)}
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
                            <div class="input-group">
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
			<div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Radio Input", "mos-faqs")}</h4>
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
                            <Radio
                                defaultValue={settingData?.base_input?.radio_input}
                                // defaultValue='radio-1'
                                options={[
                                    { value: 'radio-1', label: 'Option 1' },
                                    { value: 'radio-2', label: 'Option 2' },
                                    { value: 'radio-3', label: 'Option 3' },
                                ]}
                                name="base_input.radio_input"
                                handleChange= {handleChange}
                                type="inline" // block
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
                            : <h4>{__("Datalist Input", "mos-faqs")}</h4>
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
                                list="browsers" 
                                value={settingData?.base_input?.datalist_input}
                                onChange={(e) => handleChange('base_input.datalist_input', e.target.value)}
                            />
                            <datalist id="browsers">
                                <option value="Edge"/>
                                <option value="Firefox"/>
                                <option value="Chrome"/>
                                <option value="Opera"/>
                                <option value="Safari"/>
                            </datalist>                          
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
                            : <h4>{__("Select Input", "mos-faqs")}</h4>
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
                            <select 
                                className="form-select"
                                value={settingData?.elements?.basic?.select_field} 
                                onChange={(e) => handleChange('elements.basic.select_field', e.target.value)}
                            >
                                <option value="select-1">Select 1</option>
                                <option value="select-2">Select 2</option>
                                <option value="select-3">Select 3</option>
                                <option value="select-4">Select 4</option>
                            </select>                         
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default withForm(BaseInput);