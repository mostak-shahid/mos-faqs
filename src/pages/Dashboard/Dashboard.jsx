import { __ } from "@wordpress/i18n";
import axios from 'axios';
import { useEffect, useState } from 'react';
import PluginCard from "../../components/PluginCard/PluginCard";
import Details from '../../data/details.json';
export default function Dashboard() {
    const [plugins, setPlugins] = useState([]);
    const [pluginsLoading, setPluginsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchPlugins = async () => {
        try {
            const response = await axios.get('https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-details.json');
            setPlugins(response.data);
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
            <div className="container-fluid p-0">
                <div className="card mt-0 mb-3 rounded-0">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-7">
                                    <h2 className="card-title">{__(`Welcome to ${Details?.name}`, "mos-faqs")} <span class="badge text-bg-light">Light</span></h2>
                                    <p className="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus illum sed, facilis consequuntur ipsa consequatur dolores nisi, sit vel est earum autem ipsam voluptas odit vero quisquam natus dolorem! Maxime tempora deserunt dolorem exercitationem animi doloremque enim maiores distinctio non!</p>
                                    <button type="button" class="btn btn-primary">Primary</button>
                                    <button type="button" class="btn">Base class</button>
                            </div>
                            <div className="col-lg-5"><div className="d-flex align-items-center justify-content-center w-100 h-100 bg-secondary text-white">Image</div></div>
                        </div>
                        
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 mb-4 mb-lg-0">
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-header">
                                Shortcode
                            </div>
                            <div className="card-body">
                                <h4 className="card-title">Card title</h4>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" className="card-link">Card link</a>
                                <a href="#" className="card-link">Another link</a>
                            </div>
                        </div>
                        
                        <div className="card mt-0 rounded-0">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-7">
                                        <h3 className="card-title">Limitless Design With Spectra Pro!</h3>
                                        <p className="card-text">Utilize advanced blocks, extensions, and premium features to create a websites that stands out!</p>
                                        <a href="#" className="card-link">Card link</a>
                                        <a href="#" className="card-link">Another link</a>
                                    </div>
                                    <div className="col-lg-5">
                                        <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-secondary text-white">Image</div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-header">
                                Extend Your Website
                            </div>
                            <div className="card-body">
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
                                    {Object.entries(plugins).map(([slug, plugin]) => (
                                        // <div key={slug} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                                        // <h3>{plugin.name}</h3>
                                        // <p><strong>Slug:</strong> {slug}</p>
                                        // <p><strong>Source:</strong> {plugin.source}</p>
                                        // {plugin.description && <p><strong>Description:</strong> {plugin.description}</p>}
                                        // </div>
                                        
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
                                        
                                    ))}
                                    </>
                                }
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">VIP Priority Support</h4>
                                <p className="card-text">Faster and exclusive support service designed for VIP assistance and benefits.</p>
                                <a href="#" className="card-link">Card link</a>
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">Join the Community</h4>
                                <p className="card-text">Got a question about the plugin, want to share your awesome project or just say hi? Join our wonderful community!</p>
                                <a href="#" className="card-link">Card link</a>
                            </div>
                        </div>
                        <div className="card mt-0 mb-3 rounded-0">
                            <div className="card-body">                                
                                <h4 className="card-title">Rate Us</h4>
                                <p className="card-text">We love to hear from you, we would appreciate every single review.</p>
                                <a href="#" className="card-link">Card link</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
