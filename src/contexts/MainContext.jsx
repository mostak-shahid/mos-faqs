import { __ } from '@wordpress/i18n';
// import axios from "axios";
import React, { createContext, useContext, useState } from "react";
// import { extractJSONFromHTML } from "../lib/Helpers";
// import menuData from "../data/pages.json"; // Load menu JSON
const MainContext = createContext();
const settingsMenu = {
    "base_input": { 
        "title": __( "Base Input", "mos-faqs" ), 
        "description": __( "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam quisquam non velit recusandae maxime, soluta labore id dignissimos tenetur, vitae nesciunt? Aspernatur nemo velit veniam adipisci obcaecati impedit alias, officiis hic ratione perspiciatis, quo molestiae expedita? Aliquam, quam dolorem? Similique enim minus error tempore necessitatibus dolorum quidem modi maiores suscipit.", "mos-faqs" ), 
        "url":"/settings/base_input"
    },
    'array_input': {
        "title": __( "Array Input", "mos-faqs" ),
        "description": __( "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam quisquam non velit recusandae maxime, soluta labore id dignissimos tenetur, vitae nesciunt? Aspernatur nemo velit veniam adipisci obcaecati impedit alias, officiis hic ratione perspiciatis, quo molestiae expedita? Aliquam, quam dolorem? Similique enim minus error tempore necessitatibus dolorum quidem modi maiores suscipit.", "mos-faqs" ), 
        "url":"/settings/array_input",
    },
    "components": { 
        "title": __( "Components", "mos-faqs" ), 
        "url":"/settings/components",      
        "sub": {
            "basic" : {
                "title": __( "Basic", "mos-faqs" ),                
                "url":"/settings/components/basic",
            },
            "advanced" : {
                "title": __( "Advanced", "mos-faqs" ),
                "url":"/settings/components/advanced",
                "sub": {
                    "advanced-1" : {
                        "title": __( "Advanced 1", "mos-faqs" ),                
                        "url":"/settings/components/advanced/advanced-1",
                    },
                    "advanced-2" : {
                        "title": __( "Advanced 2", "mos-faqs" ),
                        "url":"/settings/components/advanced/advanced-2",                        
                    }
                }
            }
        }
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
