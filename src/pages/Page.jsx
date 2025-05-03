import { __ } from "@wordpress/i18n";
import React from 'react';
import Switch from '../components/Switch/Switch';
import { useMain } from '../contexts/MainContext';
import withForm from '../pages/withForm';
const Page = ({handleChange}) => {
    const {
        settingData,
        settingLoading
    } = useMain();
    return (
        <>
            <div className="row justify-content-between">
                <div className="col-lg-10">
                    {
                        settingLoading 
                        ? <div className="loading-skeleton" style={{width: '60%', height: '20px'}}></div>
                        : <h5 className="pl-heading-1 fw-600 text-text">{__("Basic Settings", "mos-faqs")}</h5>
                    }
                    <h6 className="pl-heading-1 fw-600 text-text">{__("Enable", "mos-faqs")}</h6>
                    <p className="pl-body text-text">{__( "Lorem ipsum dolor sit amet consectetur", "mos-faqs" )}</p>
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
export default withForm(Page);