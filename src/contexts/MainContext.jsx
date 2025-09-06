import { __ } from '@wordpress/i18n';
// import axios from "axios";
import { createContext, useContext, useState } from "react";
// import { extractJSONFromHTML } from "../lib/Helpers";
// import menuData from "../data/pages.json"; // Load menu JSON
const MainContext = createContext();
const settingsMenu = {
    "general" : {
        "title": __( "General", "mos-faqs" ), 
        "description": __( "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam quisquam non velit recusandae maxime, soluta labore id dignissimos tenetur, vitae nesciunt? Aspernatur nemo velit veniam adipisci obcaecati impedit alias, officiis hic ratione perspiciatis, quo molestiae expedita? Aliquam, quam dolorem? Similique enim minus error tempore necessitatibus dolorum quidem modi maiores suscipit.", "mos-faqs" ), 
        "url":"/settings/general",
        "sub": {
            "unit" : {
                "title": __( "FAQ Unit", "mos-faqs" ),                
                "url":"/settings/general/unit",
            },
            "title" : {
                "title": __( "FAQ Title", "mos-faqs" ),                
                "url":"/settings/general/title",
            },
            "content" : {
                "title": __( "FAQ Content", "mos-faqs" ),                
                "url":"/settings/general/content",
            },
            "icon" : {
                "title": __( "FAQ Icon", "mos-faqs" ),                
                "url":"/settings/general/icon",
            },
        }
    },
    "woocommerce": {
        "title": __( "WooCommerce", "mos-faqs" ), 
        "description": __( "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam quisquam non velit recusandae maxime, soluta labore id dignissimos tenetur, vitae nesciunt? Aspernatur nemo velit veniam adipisci obcaecati impedit alias, officiis hic ratione perspiciatis, quo molestiae expedita? Aliquam, quam dolorem? Similique enim minus error tempore necessitatibus dolorum quidem modi maiores suscipit.", "mos-faqs" ), 
        "url":"/settings/woocommerce",
    },
    "export": { 
        "title": __( "Expport", "mos-faqs" ), 
        "description": __( "Export your settings and FAQs.", "mos-faqs" ), 
        "url":"/settings/export",
        "sub": {
            "faqs" : {
                "title": __( "FAQs", "mos-faqs" ),                
                "url":"/settings/export/faqs",
            },
            "settings" : {
                "title": __( "Settings", "mos-faqs" ),                
                "url":"/settings/export/settings",
            },
        }
    },
    "import": { 
        "title": __( "Import", "mos-faqs" ), 
        "description": __( "Import your settings and FAQs.", "mos-faqs" ), 
        "url":"/settings/import",
        "sub": {
            "faqs" : {
                "title": __( "FAQs", "mos-faqs" ),                
                "url":"/settings/import/faqs",
            },
            "settings" : {
                "title": __( "Settings", "mos-faqs" ),                
                "url":"/settings/import/settings",
            },
        }
    },
    "more": { 
        "title": __( "More", "mos-faqs" ), 
        "description": __( "Adding more features to your Store.", "mos-faqs" ), 
        "url":"/settings/more"
    },
    "feedback": { 
        "title": __( "Feedback", "mos-faqs" ), 
        "description": __( "We\'re constantly enhancing our product, and your feedback is key to staying ahead of the curve and delivering a stronger, more reliable security solution for you.", "mos-faqs" ), 
        "url":"/settings/feedback"
    },
};


export const MainProvider = ({ children }) => {
    const [settingData, setSettingData] = useState({});
    const [settingLoading, setSettingLoading] = useState(true);
    const [settingReload, setSettingReload] = useState(true);
    return (
        <MainContext.Provider
            value={{
                settingData, 
                setSettingData,
                settingLoading,
                setSettingLoading,
                settingsMenu,
                settingReload, 
                setSettingReload
            }}
        >
            {children}
            {/* {console.log('settingData from contex API', settingData)} */}
        </MainContext.Provider>
    );
};

export const useMain = () => useContext(MainContext);
