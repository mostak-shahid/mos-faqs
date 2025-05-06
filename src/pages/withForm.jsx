
import { __ } from "@wordpress/i18n";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import MultiLevelListGroup from "../components/MultiLevelListGroup/MultiLevelListGroup";
import { useMain } from "../contexts/MainContext";
import Notice from "../layouts/Notice/Notice";
import { formDataPost, setNestedValue, urlToArr } from "../lib/Helpers"; // Import utility function
const withForm = (OriginalComponent) => {     
    function NewComponent() {
        const {
            settingData, 
            setSettingData,
            settingLoading,
            setSettingLoading,
            settingsMenu,
            settingReload,
            setSettingReload
        } = useMain();
        
        const [saveLoading, setSaveLoading] = useState(false)
        const [saveError, setSaveError] = useState(null)

        const [showFormNotice, setShowFormNotice] = useState(false)

        const [resetLoading, setResetLoading] = useState(false)
        const [resetError, setResetError] = useState(null)

        const [resetAllLoading, setResetAllLoading] = useState(false)
        const [resetAllError, setResetAllError] = useState(null)
        
        const [processing, setProcessing] = useState(false)

        const urlArr = urlToArr();
        
        const OPTIONS_API_URL = "/wp-json/mos-faqs/v1/options";

        useEffect(() => {
            const baseURL = '/wp-json/mos-faqs/v1';        
            const fetchSettingData = async () => {
                try {
                    const response = await axios.get(`${baseURL}/options`);
                    setSettingData(response.data);
                    setSettingLoading(false)
                } catch (error) {
                    console.log(error);
                }
            };
        
            fetchSettingData();
          }, [settingReload]);

        // Handle changes from child components
        const handleChange = (fieldPath, value) => {
            // console.log("Field changed:", fieldPath, "New value:", value);
            setSettingData(prev => {
                const updatedOptions = setNestedValue(prev, fieldPath, value);
                return { ...updatedOptions }; // Ensure React detects the update
            });
        };
        const handleSave = () => {
            setProcessing(true);
            setSaveLoading(true);
            setSaveError(null);
            axios.post(OPTIONS_API_URL, {'mos_faqs_options': settingData})
            .then(response => {
                window.scrollTo(0, 0);
                console.log("Settings saved successfully:", response.data);
                setSaveLoading(false)        
                setProcessing(false)
                setShowFormNotice(true)
                setTimeout(()=> {
                    setShowFormNotice(false)
                },3000)
            })
            .catch(
                error => console.error("Error saving settings:", error)
            );
        };
        const handleReset = async (name) => {
            console.log(name)
            const confirmation = window.confirm(__( "Are you sure you want to proceed?", "mos-faqs" ));
            let result;
            if (confirmation) {       
                setProcessing(true);     
                setResetLoading(true);
                setResetError(null);            
                try {
                    result = await formDataPost('mos_faqs_reset_settings', {name:name}); 
                    setSettingReload(Math.random);
                } catch (error) {
                    setResetError(error.message);
                } finally {
                    setResetLoading(false);
                    setProcessing(false);
                }
            }
        };
        const handleResetAll = async () => {
            const confirmation = window.confirm(__( "Are you sure you want to proceed?", "mos-faqs" ));
            let result;
            if (confirmation) {       
                setProcessing(true);     
                setResetAllLoading(true);
                setResetAllError(null);         
                try {
                    result = await formDataPost('mos_faqs_reset_all_settings', {}); 
                    setSettingReload(Math.random);
                } catch (error) {
                    setResetError(error.message);
                } finally {
                    setProcessing(false);     
                    setResetAllLoading(false);
                }
            }
        };
        useEffect(() => {
        }, [])
        return (
            <>
                {
                    showFormNotice && 
                    <div className="container-fluid"><Notice /></div>
                }
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
                                        Title
                                    </div>
                                    <div className="card-body">        
                                        <OriginalComponent handleChange={handleChange} />
                                    </div>
                                    <div className="card-footer d-flex gap-2">
                                        <button 
                                            type="button" 
                                            className="button button-primary" 
                                            onClick={handleSave}
                                            disabled={processing}
                                        >
                                            {
                                                saveLoading ? __( "Saving...", "mos-faqs" ) : __( "Save Changes", "mos-faqs" )
                                            }
                                        </button>
                                        <button 
                                            className="button button-secondary"
                                            data-menu={`${urlArr[0]}.${ urlArr[urlArr.length-1]}`}
                                            onClick={() => handleReset(`${urlArr[0]}.${ urlArr[urlArr.length-1]}`)}
                                            disabled={processing}
                                        >
                                            {resetLoading ? __( "Resetting...", "mos-faqs" ) : __( "Reset Settings", "mos-faqs" )}
                                        </button>
                                        <button 
                                            className="button button-secondary"
                                            onClick={handleResetAll}
                                            disabled={processing}
                                        >
                                            {resetAllLoading ? __( "Resetting...", "mos-faqs" ) : __( "Reset All", "mos-faqs" )}
                                        </button>

                                        {resetAllError && <div className="usfw-error">{resetAllError}</div>}
                                        {resetError && <div className="usfw-error">{resetError}</div>}
                                        {saveError && <div className="usfw-error">{saveError}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
    return NewComponent;    
}
export default withForm;