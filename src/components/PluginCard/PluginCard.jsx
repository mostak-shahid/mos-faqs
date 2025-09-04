import { __ } from "@wordpress/i18n";
import { useEffect, useState } from 'react';
import { formDataPost } from "../../lib/Helpers"; // Import utility function
import './PluginCard.scss';
export default function PluginCard({image, name, intro, plugin_source='internal', plugin_slug='', plugin_file='', download_url=''}) {
    /*
    data-sub_action="install_activate" 
    data-plugin_source="external" 
    data-download_url="https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip"
    data-plugin_slug="mos-woocommerce-protected-categories-main" 
    data-plugin_file="mos-woocommerce-protected-categories.php" 

    data-sub_action="install_activate"  
    data-plugin_source="internal" 
    data-plugin_slug="mos-product-specifications-tab"
    */
    const [pluginStatus, setPluginStatus] = useState("checking");
    const [pluginFile, setPluginFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Check plugin status on component mount
    useEffect(() => {
        checkPluginStatus();
    }, [plugin_slug]);
    const checkPluginStatus = async () => {
        setPluginStatus("checking");
        setErrorMessage("");
        try {
            const result = await formDataPost('mos_faqs_ajax_plugins_status', {
                file:plugin_file,
            });
            // console.log("Result:", result); // check structure here
            setPluginStatus(result?.data?.success_message); // Fix this line based on actual response
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            // setPluginStatusLoading(false);
        }
    };

    const handlePlugin = async () => {              
        // setProcessing(true);     
        // setActionError(null);   
        // setStatus(status === 'not_active'?'activating':'installing')         
        // try {
        //     const result = await formDataPost('mos_faqs_ajax_install_plugins', {
        //         sub_action:sub_action,
        //         download_url:download_url,                
        //         plugin_slug:plugin_slug,
        //         plugin_file:plugin_file,
        //         plugin_source:plugin_source,
        //     }); 
        //     console.log("Result:", result); // check structure here
        //     setStatus(result.data)
        // } catch (error) {
        //     setActionError(error.message);
        // } finally {
        //     setProcessing(false);
        //     // setStatus(status === 'activating'?'active':'not_active') 
        // }
    };
    
    
    const getButtonLabel = () => {
        switch (pluginStatus) {
            case "checking":
                return __("Checking...", "mos-faqs");
            case "not_installed":
                return __("Install Now", "mos-faqs");
            case "installed":
                return __("Activate", "mos-faqs");
            case "installing":
                return __("Installing...", "mos-faqs");
            case "installation_complete": // New state
                return __("Installed", "mos-faqs");
            case "activating":
                return __("Activating...", "mos-faqs");
            case "activated":
                return __("Activated", "mos-faqs");
            case "error":
                return __("Try Again", "mos-faqs");
            default:
                return __("Install Now", "mos-faqs");
        }
    };
    const handleButtonClick = () => {
		switch (pluginStatus) {
			case "not_installed":
				installPlugin();
				break;
			case "installed":
				activatePlugin();
				break;
			case "error":
				checkPluginStatus();
				break;
			default:
				break;
		}
	};       
    
    const installPlugin = async () => {
        setPluginStatus("installing");
        setErrorMessage("");
        try {
            const result = await formDataPost('mos_faqs_ajax_install_plugins', {
                sub_action:'install',
                download_url:download_url,                
                plugin_slug:plugin_slug,
                plugin_file:plugin_file,
                plugin_source:plugin_source,
            }); 
            console.log("Result:", result); // check structure here
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setPluginStatus("installed"); 
        }
    };

    const activatePlugin = async () => {
        setPluginStatus("activating");
        setErrorMessage("");        
        try {
            const result = await formDataPost('mos_faqs_ajax_install_plugins', {
                sub_action:'activate',
                download_url:download_url,                
                plugin_slug:plugin_slug,
                plugin_file:plugin_file,
                plugin_source:plugin_source,
            }); 
            console.log("Result:", result); // check structure here
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setPluginStatus("activated"); 
        }
    };
    const isButtonDisabled = ["checking", "installing", "activating","installation_complete"].includes(
		pluginStatus,
	);
    return (
        <div className="row g-2 safq-plugin-card align-items-center"> 
            <div className="col-auto">
                <div style={{width:'60px', height:'60px'}}>
                    <img className="img-fluid" src={image} alt="" />
                </div>
            </div>
            <div className="col">
                <h4 className="title m-0" dangerouslySetInnerHTML={{ __html: name }}/>
                {/* <p className="intro m-0" dangerouslySetInnerHTML={{ __html: intro }}/> */}
                <div className="action">
                    <button 
                        onClick={handleButtonClick}
                        className={`link install-button ${pluginStatus}`}
                        disabled={isButtonDisabled}
                    >                            
                        {getButtonLabel()}
                    </button>
                </div>
            </div>
        </div>
    )
}
