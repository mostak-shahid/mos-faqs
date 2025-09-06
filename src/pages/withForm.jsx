
import { __ } from "@wordpress/i18n";
import axios from "axios";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MultiLevelListGroup from "../components/MultiLevelListGroup/MultiLevelListGroup";
import PageInfo from "../components/PageInfo/PageInfo";
import { useMain } from "../contexts/MainContext";
import { formDataPost, setNestedValue, urlToArr } from "../lib/Helpers"; // Import utility function
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

import logo from '../assets/images/logo.svg';
import Details from '../data/details.json';
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

        const [showToast, setShowToast] = useState(false)

        const [resetLoading, setResetLoading] = useState(false)
        const [resetError, setResetError] = useState(null)

        const [resetAllLoading, setResetAllLoading] = useState(false)
        const [resetAllError, setResetAllError] = useState(null)
        
        const [processing, setProcessing] = useState(false)

        const urlArr = urlToArr();

        const location = useLocation();
        
        const OPTIONS_API_URL = "/wp-json/mos-faqs/v1/options";

        useEffect(() => {
            const baseURL = '/wp-json/mos-faqs/v1';        
            const fetchSettingData = async () => {
                try {
                    const response = await axios.get(`${baseURL}/options`, {headers: {'X-WP-Nonce': mos_faqs_ajax_obj.api_nonce }});
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
            axios.post(
                OPTIONS_API_URL, 
                {'mos_faqs_options': settingData},
                {
                    headers: {
                        'X-WP-Nonce': mos_faqs_ajax_obj.api_nonce,
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then(response => {
                window.scrollTo(0, 0);
                // console.log("Settings saved successfully:", response.data);
                setSaveLoading(false)        
                setProcessing(false)
                setShowToast(true)
                
            })
            .catch(
                error => console.error("Error saving settings:", error)
            );
        };
       const handleReset = async (name) => {
            // console.log(name)
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
                <ToastContainer
                    className="p-3"
                    // position="end"
                    style={{ zIndex: 9999, top:'43px', right:0 }}
                >
                    <Toast 
                        bg="success"
                        onClose={() => setShowToast(false)} 
                        show={showToast} 
                        delay={3000} 
                        autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto">{__('Saved',"mos-faqs")}</strong>
                        </Toast.Header>
                        <Toast.Body>
                            {__(
                                'All changes have been applied correctly, ensuring your preferences are now in effect.',                                                        
                                "mos-faqs"
                            )}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
                <div className="mos-faqs-settings">
                    <div className="container">
                        <div className="row g-0">
                            <div className="col-lg-3 d-none d-lg-block">
                                <div className="mos-faqs-sidebar card mt-0 py-3 rounded-0" style={{marginRight:'-1px', height: "100%"}}> 
                                    <div className="plugin-info d-flex flex-column align-items-center gap-2 p-3 border-bottom">
                                        <img className="img-fluid" src={`${mos_faqs_ajax_obj.image_url}logo.svg`} alt="" width="100" height="100" />
                                        <span className="fw-bold">{Details?.name}</span>
                                        <span>{Details?.version}</span>
                                    </div>                           
                                    <MultiLevelListGroup  data={settingsMenu}/>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="card mt-0 rounded-0" style={{height: "100%"}}>
                                    <PageInfo url={location.pathname} />
                                    <div className="card-body">        
                                        <OriginalComponent handleChange={handleChange} />
                                    </div>
                                    {/* {console.log(location.pathname)} */}
                                    {
                                        (location.pathname!='/settings/feedback' && location.pathname!='/settings/import_export') && 
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
                                                {/* <button 
                                                    className="button button-secondary"
                                                    data-menu={`${urlArr[0]}.${ urlArr[urlArr.length-1]}`}
                                                    onClick={() => handleReset(`${urlArr[0]}.${ urlArr[urlArr.length-1]}`)}
                                                    disabled={processing}
                                                >
                                                    {resetLoading ? __( "Resetting...", "mos-faqs" ) : __( "Reset Settings", "mos-faqs" )}
                                                </button> */}
                                                <button 
                                                    className="button button-secondary"
                                                    onClick={handleResetAll}
                                                    disabled={processing}
                                                >
                                                    {resetAllLoading ? __( "Resetting...", "mos-faqs" ) : __( "Reset", "mos-faqs" )}
                                                </button>

                                                {resetAllError && <div className="mos-faqs-error">{resetAllError}</div>}
                                                {resetError && <div className="mos-faqs-error">{resetError}</div>}
                                                {saveError && <div className="mos-faqs-error">{saveError}</div>}
                                            </div>
                                    }
                                    
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