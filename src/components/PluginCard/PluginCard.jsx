import { useEffect, useState } from 'react';
import { formDataPost } from "../../lib/Helpers"; // Import utility function
import './PluginCard.scss';
// import { __ } from "@wordpress/i18n";
export default function PluginCard({image, name, intro, source='internal', download_url='', slug='', plugin_file=''}) {
    const [status, setStatus] = useState('checking');
    const [pluginStatusLoading, setPluginStatusLoading] = useState(true);
    const [error, setError] = useState(null);

    const [processing, setProcessing] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [buttonText, setButtonText] = useState('Checking...');
    useEffect(() => {
        const fetchPluginStatus = async () => {
            try {
                const result = await formDataPost('mos_faqs_ajax_plugins_status', {
                    file:plugin_file,
                });
                // console.log("Result:", result); // check structure here
                setStatus(result?.data?.success_message); // Fix this line based on actual response
            } catch (error) {
                setError(error.message);
            } finally {
                setPluginStatusLoading(false);
            }
        };
        fetchPluginStatus();
    }, [status]);
    useEffect(() => {
        if (status === 'not_active') {
            setButtonText('Activate');
        } else if (status === 'active') {
            setButtonText('Activated');
        } else if (status === 'activating') {
            setButtonText('Activating');
        } else if (status === 'installing') {
            setButtonText('Installing');
        } else if (status === 'not_installed') {
            setButtonText('Install');
        } else {
            setButtonText('Checking..');
        }
    }, [status]);

    const action = status === 'not_active' ? 'activate' : 'install';

    const handlePlugin = async (action, slug) => {              
        setProcessing(true);     
        setActionError(null);   
        setStatus(status === 'not_active'?'activating':'installing')         
        try {
            const result = await formDataPost('mos_faqs_ajax_install_plugins', {
                sub_action:action,
                slug:slug,
                plugin_file:plugin_file
            }); 
            setStatus(result.data)
        } catch (error) {
            setActionError(error.message);
        } finally {
            setProcessing(false);
            // setStatus(status === 'activating'?'active':'not_active') 
        }
    };
    return (
        <div className="row g-2 PluginCard"> 
            {
                // pluginStatusLoading && 
                // console.log('slug', slug, ', plugin_file', plugin_file, ', status', status)
            }                                  
            <div className="col-auto">
                <div style={{width:'60px', height:'60px'}}>
                    <img className="img-fluid" src={image} alt="" />
                </div>
            </div>
            <div className="col d-flex flex-column justify-content-between">
                <h4 className="title m-0" dangerouslySetInnerHTML={{ __html: name }}/>
                {/* <p className="intro m-0" dangerouslySetInnerHTML={{ __html: intro }}/> */}
                
                {
                    pluginStatusLoading 
                    ? <div className="loading-skeleton h4" style={{width:'60%', height: '24px', marginBottom: '5px'}}></div> 
                    : <div className="action">
                        {
                            status !== 'active' 
                            ?
                            <span className="link"
                                href="#"
                                onClick={() => handlePlugin(action, slug, plugin_file)}
                            >
                                {
                                    buttonText
                                }
                            </span>
                            : <span className="link">Activated</span>
                        }
                        
                    </div>
                }
            </div>
            {/* 
            <button type="button" data-sub_action="install_activate" data-plugin_source="external" data-download_url="https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip" data-plugin_slug="mos-woocommerce-protected-categories-main" data-plugin_file="mos-woocommerce-protected-categories.php" id="mos-install-activate" class="mos-faqs-install-github-plugin button button-primary">Install & Activate Plugin</button>
            <button type="button" data-sub_action="install" data-plugin_source="external" data-download_url="https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip" data-plugin_slug="mos-woocommerce-protected-categories-main" data-plugin_file="mos-woocommerce-protected-categories.php" id="mos-install" class="mos-faqs-install-github-plugin button">Install Plugin</button>
            <button type="button" data-sub_action="activate" data-plugin_source="external" data-download_url="https://github.com/mostak-shahid/mos-woocommerce-protected-categories/archive/refs/heads/main.zip" data-plugin_slug="mos-woocommerce-protected-categories-main" data-plugin_file="mos-woocommerce-protected-categories.php" id="mos-activate" class="mos-faqs-install-github-plugin button">Activate Plugin</button>

            <!-- mos-product-specifications-tab -->
            <button type="button" data-sub_action="install_activate"  data-plugin_source="internal" data-plugin_slug="mos-product-specifications-tab" id="mos-install-activate" class="mos-faqs-install-github-plugin button button-primary">Install & Activate Plugin</button>
            <button type="button" data-sub_action="install"  data-plugin_source="internal" data-plugin_slug="mos-product-specifications-tab" id="mos-install" class="mos-faqs-install-github-plugin button">Install Plugin</button>
            <button type="button" data-sub_action="activate"  data-plugin_source="internal" data-plugin_slug="mos-product-specifications-tab" id="mos-activate" class="mos-faqs-install-github-plugin button">Activate Plugin</button>
            */}
        </div>
    )
}
