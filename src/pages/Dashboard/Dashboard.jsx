import { __ } from "@wordpress/i18n";
import axios from 'axios';
import { useEffect, useState } from 'react';
import PluginCard from "../../components/PluginCard/PluginCard";
import { useMain } from '../../contexts/MainContext';
import Details from '../../data/details.json';
import './Dashboard.scss';
// axios.defaults.headers.common["X-WP-Nonce"] = mos_faqs_ajax_obj.api_nonce;
export default function Dashboard() {
    const {
        settingsMenu,
    } = useMain();
    const [plugins, setPlugins] = useState([]);
    const [pluginsLoading, setPluginsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPlugins = async () => {
            try {
                // const response = await axios.get('https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-details.json');
                const response = await axios.get(`/wp-json/mos-faqs/v1/plugins`);
                // 
                setPlugins(response.data.plugins);
            } catch (error) {
                setError('Error fetching plugin data:', error);
            } finally {
                setPluginsLoading(false);
            }
        };
        fetchPlugins();
    }, []);
    
    return (
        <div className="mos-faqs-settings">
            <div className="container">
                <div className="card mt-0 mb-3 rounded-0">
                    <div className="card-body p-5">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <h2 className="card-title">{__(`Welcome to ${Details?.name}`, "mos-faqs")}</h2>
                                <div className="card-text">
                                    <p>
                                        {__("A simple FAQ plugin that lets you create FAQs, order FAQs, publicize FAQs, etc. It uses custom post types and taxonomies to manage an FAQ section for your site. You can display your every FAQ section in 3 different ways accordion, collapsible, and block view. Includes shortcode options for different display configurations.", "mos-faqs")}
                                    </p>
                                    
                                    <p>                                            
                                        {__("Mos FAQs can do more than just FAQs. If you have a help desk or knowledge base and need to pass on information to your visitors and/or users, the question/answer formatting is perfect. With the various options related to toggling, as well as the custom fields functionality, you can easily create an in-depth knowledge base and help desk.", "mos-faqs")}
                                    </p>
                                    <p>
                                        {__('Mos FAQs has a responsive design that makes your FAQs look good on all screen sizes and all devices. No more worrying about what your mobile FAQs might look like. All options and styling will be applied across all devices, so you can focus on your content.', 'mos-faqs')}
                                    </p>
                                    <p>
                                        {__('A few extra seconds could have a huge impact on your ability to engage visitors and make sales. This means that having a fast site is essential — not just for ranking well with Google, but for keeping your bottom-line profits high. So losing page speed for a plugin is a very pain full experience, by default Mos FAQs plugin fully optimized and it will not add any additional load into your website.', 'mos-faqs')}
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-4 text-center mt-4 mt-lg-0">
                                <img className="img-fluid" src={`${mos_faqs_ajax_obj.image_url}dashboard-banner.png`} alt="" />
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 mb-4 mb-lg-0">
                        <div className="dashboard-features-card card mt-0 mb-3 rounded-0">
                            <div className="card-header">
                                {__("Features", "mos-faqs")}
                            </div>
                            <div className="card-body ">
                                {Object.values(settingsMenu).map(feature => (
                                    <div className="feature">
                                        <h4 className="feature-title">{feature?.title}</h4>
                                        <div className="feature-intro">{feature?.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-header">
                                {__("Extend Your Website", "mos-faqs")}
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {
                                        pluginsLoading 
                                        ? 
                                        <div className="row g-2 mb-3">                                    
                                            <div className="col-auto">
                                                <div className="loading-skeleton" style={{width:'60px', height:'60px'}}></div>
                                            </div>
                                            <div className="col">
                                                <div className="loading-skeleton h4" style={{width:'60%', height: '15px', marginBottom: '5px'}}></div>
                                                <div className="loading-skeleton p" style={{width:'80%',height: '15px', marginBottom: '5px'}}></div>
                                                <div className="action"><div className="loading-skeleton p mb-0" style={{width:'80%',height: '24px', marginBottom: '5px'}}></div></div>
                                            </div>
                                        </div>
                                        : <>
                                        {/* {Object.entries(plugins).map(([slug, plugin]) => ( 
                                            <div className="col-lg-6">
                                                <PluginCard 
                                                    key={slug} 
                                                    image={plugin.image} 
                                                    name={plugin.name} 
                                                    intro={plugin.intro} 
                                                    plugin_source={plugin.source} 
                                                    plugin_slug={slug} 
                                                    plugin_file={plugin.file} 
                                                    download_url={plugin.download}
                                                /> 
                                            </div> 
                                            ))
                                        } */}
                                        {plugins.map((plugin) => ( 
                                            <div className="col-lg-6">
                                                {/* {console.log(plugin.icons['1x'])} */}
                                                <PluginCard 
                                                    key={plugin.slug} 
                                                    image={plugin.icons['1x']} 
                                                    name={plugin.name} 
                                                    intro={plugin.short_description} 
                                                    plugin_source='internal'
                                                    plugin_slug={plugin.slug} 
                                                    plugin_file={`${plugin.slug}/${plugin.slug}.php`} 
                                                    download_url={plugin.download_link}
                                                /> 
                                            </div> 
                                            ))
                                        }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">
                                    {__("VIP Priority Support", "mos-faqs")}
                                </h4>
                                <p className="card-text">
                                    {__("Faster and exclusive support service designed for VIP assistance and benefits.", "mos-faqs")}                                    
                                </p>
                                <a href="#" className="card-link">
                                    {__("Support", "mos-faqs")}
                                </a>
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">
                                    {__("Join the Community", "mos-faqs")}                                    
                                </h4>
                                <p className="card-text">
                                    {__("Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!", "mos-faqs")}                                    
                                </p>
                                <a href="#" className="card-link">
                                    {__("Join", "mos-faqs")}
                                </a>
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">
                                    {__("Rate Us", "mos-faqs")}                                    
                                </h4>
                                <p className="card-text">
                                    {__("We love to hear from you, we would appreciate every single review.", "mos-faqs")}                                    
                                </p>
                                <a href="#" className="card-link">
                                    {__("Rate", "mos-faqs")}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
