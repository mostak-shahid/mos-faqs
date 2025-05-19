import { useEffect, useState } from 'react';
import { formDataPost } from "../../lib/Helpers"; // Import utility function
import './PluginCard.scss';
export default function PluginCard({image, name, intro, action='checking', source='internal', download_url='', slug='', plugin_file=''}) {
    const [status, setStatus] = useState({});
    const [pluginStatusLoading, setPluginStatusLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPluginStatus = async () => {
            // try {
            //     const response = await axios.get('https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-details.json');
            //     setPlugins(response.data);
            // } catch (error) {
            //     setError('Error fetching plugin data:', error);
            // } finally {
            //     setPluginStatusLoading(false);
            // }



            try {
                result = await formDataPost('mos_faqs_ajax_plugins_status', {file:plugin_file}); 
                setStatus(result?.success_message);
                console.log(result)
            } catch (error) {
                setError(error.message);
            } finally {
                setPluginStatusLoading(false);
            }
        };
        fetchPluginStatus();
    }, [plugin_file]);
    return (
        <div className="row g-2 PluginCard"> 
            {
                pluginStatusLoading && 
                console.log('slug', slug, ', plugin_file', plugin_file, ', status', status)
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
                    pluginStatusLoading ?
                    <div className="loading-skeleton h4" style={{width:'60%', height: '24px', marginBottom: '5px'}}></div> :
                    <div className="action"><a href="#">{status}</a></div>
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
