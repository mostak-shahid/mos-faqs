import '@coreui/icons/css/all.css';
import { __ } from "@wordpress/i18n";
import React from 'react';
import { useMain } from '../contexts/MainContext';
import withForm from '../pages/withForm';

const ComponentsBasic = ({handleChange}) => {
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
                            : <h4>{__("IP", "mos-faqs")}</h4>
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
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={settingData?.components?.basic?.ip}
                                    onChange={(e) => handleChange('components.basic.ip', e.target.value)}
                                />
                                <span class="input-group-text" id="basic-addon1"><i className="cil-reload"></i></span>
                            </div>                            
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default withForm(ComponentsBasic);