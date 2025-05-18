
export default function PluginCard({image, name, intro, action='checking', source='internal', download_url='', slug='', plugin_file=''}) {
    return (
        <>                                    
            <div className="col-auto">
                <div style={{width:'60px', height:'60px'}}>
                    <img className="img-fluid" src={image} alt="" />
                </div>
            </div>
            <div className="col">
                <h4 className="title m-0" dangerouslySetInnerHTML={{ __html: name }}/>
                <p className="intro m-0" dangerouslySetInnerHTML={{ __html: intro }}/>
                <div className="action"><a href="#" className="card-link">Card link</a></div>
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
        </>
    )
}
