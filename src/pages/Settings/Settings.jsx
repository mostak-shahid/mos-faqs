import { __ } from "@wordpress/i18n";
import React from 'react';
import MultiLevelListGroup from '../../components/MultiLevelListGroup/MultiLevelListGroup';
import Switch from '../../components/Switch/Switch';
import { useMain } from "../../contexts/MainContext";
export default function Settings() {
    const {
        settingData, 
        settingLoading,
        settingsMenu,
    } = useMain();
    return (
        <div className="mos-faqs-settings">
            <div className="container">
                <div className="row g-0">
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="card mt-0 rounded-0" style={{marginRight:'-1px', height: "100%"}}>                            
                        <MultiLevelListGroup  data={settingsMenu}/>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="card mt-0 rounded-0" style={{height: "100%"}}>
                            <div className="card-header">
                                Featured
                            </div>
                            <div className="card-body">

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
                                            // checked={settingData?.elements?.basic?.switch} // Pass "1"/"0" from API 
                                            // onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer d-flex gap-2">
                                <button type="button" class="btn btn-primary btn-sm">Save</button>
                                <button type="button" class="btn btn-outline-primary btn-sm">Reset</button>
                                <button type="button" class="btn btn-outline-primary btn-sm">Reset All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
