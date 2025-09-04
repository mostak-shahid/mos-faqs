import { __ } from "@wordpress/i18n";
import { useState } from 'react';
import { useMain } from '../contexts/MainContext';
import withForm from '../pages/withForm';
const ImportExport = ({handleChange}) => {
    const {
        settingData,
        settingLoading,
        setSettingReload
    } = useMain();
    const [importData, setImportData] = useState('');
    

    const [processingExport, setProcessingExport] = useState(false)

    // Export settings as a downloadable JSON file
    const handleExport = () => {
        const blob = new Blob([JSON.stringify(settingData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'mos-faqs-settings.json';
        link.click();
    };

    // Import settings from uploaded JSON
    const handleImport = async () => {
        setProcessingExport(true);
        try {
            const parsed = JSON.parse(importData);
            const response = await fetch('/wp-json/mos-faqs/v1/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed)
            });

            const result = await response.json();
            if (result.success) {
                // alert('Settings imported successfully!');
                setSettingReload(Math.random());
            } else {
                // console.log('Import failed.');
            }
        } catch (e) {
            // console.log('Invalid JSON.');
        }
        setProcessingExport(false);
    };


    // Read file content and put it in hidden textarea
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                JSON.parse(content); // Validate JSON
                setImportData(content);
            } catch (err) {
                alert('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    };
    return (
        <>
            <div className="setting-unit border-bottom py-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Export Settings", "mos-faqs")}</h4>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '70%'}}></div>
                            : <p>{__("Export your current settings", "mos-faqs")}</p>
                        }
                    </div>    
                    {
                        !settingLoading &&                               
                        <div className="col-lg-5">
                            <button                                 
                                type="button" 
                                className="button button-link" 
                                onClick={handleExport}
                            >
                                {__( "Export Settings", "mos-faqs" )}
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div className="setting-unit pt-4">
                <div className="row justify-content-between">
                    <div className="col-lg-7">
                        {
                            settingLoading 
                            ? <div className="loading-skeleton h4" style={{width: '60%'}}></div>
                            : <h4>{__("Import Settings", "mos-faqs")}</h4>
                        }
                        {
                            settingLoading 
                            ? <div className="loading-skeleton p" style={{width: '70%'}}></div>
                            : <p>{__("Copy and paste here", "mos-faqs")}</p>
                        }
                    </div>    
                    {
                        !settingLoading &&                               
                        <div className="col-lg-5">
                            <div>
                                <input
                                    type="file"
                                    accept="application/json"
                                    onChange={handleFileChange}
                                />
                                <div className="d-flex align-items-center">                                            
                                    <button 
                                        type="button" 
                                        className="button button-link" 
                                        onClick={handleImport} 
                                        disabled={!importData}
                                    >
                                        {
                                            processingExport ? __( "Processing...", "mos-faqs" ) : __( "Import Settings", "mos-faqs" )
                                        }
                                    </button>

                                </div>

                                {/* Hidden textarea with the JSON content */}
                                <textarea
                                    style={{ display: 'none' }}
                                    value={importData}
                                    readOnly
                                ></textarea>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
export default withForm(ImportExport);