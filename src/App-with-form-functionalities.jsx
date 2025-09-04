import apiFetch from '@wordpress/api-fetch';
import { __ } from "@wordpress/i18n";
import React, { useEffect, useState } from 'react';
import "./App.css";
import Header from './layouts/Header/Header';
import { setNestedValue } from "./lib/Helpers"; // Import utility function
// import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import Loading from './pages/Loading/Loading';
import Settings from './pages/Settings/Settings';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
const NotFound = () => (
  <div>
      <h2>{__( "404 - Page Not Found", "mos-faqs" )}</h2>
      <p>{__( "The page you are looking for does not exist.", "mos-faqs" )}</p>
      <Link to="/">{__( "Go back to Home", "mos-faqs" )}</Link>
  </div>
);
function App() {
  const [settingLoading, setSettingLoading] = useState(true);
  const [settingData, setSettingData] = useState({});
  const options = [
    {'option-1': 'Option 1'},
    {'option-2': 'Option 2'},
    {'option-3': 'Option 3'},
    {'option-4': 'Option 4'},
  ];
  const options_2 = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
  ];
  
  const OPTIONS_API_URL = "/mos-faqs/v1/options"; // No /wp-json here, apiFetch adds it
  //const isChecked = checked === "1" || checked === true || checked === 1;
  useEffect(() => {
    const fetchSettingData = async () => {
        try {
            const data = await apiFetch({ path: OPTIONS_API_URL });
            setSettingData(data);
            setSettingLoading(false);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };    
    fetchSettingData();
  }, []);
  const [processing, setProcessing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const handleSave = async () => {
    setProcessing(true);
    setSaveLoading(true);
    setSaveError(null);

    try {
      const response = await apiFetch({
        path: OPTIONS_API_URL,
        method: 'POST',
        data: { mos_faqs_options: settingData },
      });

      window.scrollTo(0, 0);
      // console.log("Settings saved successfully:", response);
      setSaveLoading(false);
      setProcessing(false);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveError(error.message || 'An unknown error occurred.');
      setProcessing(false);
      setSaveLoading(false);
    }
  };
  const [resetError, setResetError] = useState(null)
  const [resetAllLoading, setResetAllLoading] = useState(false)
  const [resetAllError, setResetAllError] = useState(null)
  const handleResetAll = async () => {
      const confirmation = window.confirm(__( "Are you sure you want to proceed?", "mos-faqs" ));
      let result;
      if (confirmation) {       
          setProcessing(true);     
          setResetAllLoading(true);
          setResetAllError(null);         
          try {
              // result = await formDataPost('mos_faqs_reset_all_settings', {}); 
              const formData = new FormData();
              // Append action and nonce
		          formData.append("action", 'mos_faqs_reset_settings');
              formData.append("_admin_nonce", mos_faqs_ajax_obj._admin_nonce);
              formData.append("name", 'all'); // Reset all settings

              const response = await apiFetch({
                url: mos_faqs_ajax_obj.ajax_url,
                method: 'POST',
                body: formData,
			          parse: false, // IMPORTANT: disable automatic parsing to handle response manually
              });

              const json = await response.json(); // parse manually

              // console.log("AJAX response:", json); // log to see structure

              // if (json.success) {
              //   return json.data || true; // return true or whatever data is needed
              // } else {
              //   throw new Error(json.data?.error_message || "Request failed");
              // }
        
              window.scrollTo(0, 0);
              // console.log("Settings saved successfully:", response);
              setResetAllLoading(false);
              setProcessing(false);
              setShowToast(true);        
              setTimeout(() => {
                setShowToast(false);
                location.reload();
              }, 1000);

          } catch (error) {
            console.error("Error saving settings:", error);
            setResetError(error.message || 'An unknown error occurred.');
            setProcessing(false);
            setResetAllLoading(false);
          }
      }
  };

  // Handle changes to the settings
  const onChange = (fieldPath, value) => {
    // console.log("Field changed:", fieldPath, "New value:", value);
    setSettingData(prev => {
        const updatedOptions = setNestedValue(prev, fieldPath, value);
        return { ...updatedOptions }; // Ensure React detects the update
    });
};
  return (
    <>
    {
      !settingLoading ? 
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
      <div className="mos-faqs-settings-container">
        <Header />
        <Routes>
            {/* <Route path="/" element={<RestrictionsSettings handleChange={handleChange} />} /> */}
            {/* <Route path="/"  element={<Navigate to="/restrictions/settings" />} /> */}
            <Route path="/"  element={<Dashboard/>} />
            <Route path="/settings"  element={<Settings />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <div className="mos-faqs-settings">
          <div className="part-title">
            <h1>{__( "React Page", "mos-faqs" )}</h1> </div>
          <div className="part-options">
            <table className="form-table" role="presentation">
              <tbody>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="text-input">Text Input</label>
                  </th>
                  <td>
                    <div className="position-relative input_text">
                      <label htmlFor="text-input">
                        <input 
                          type="text" 
                          name="mos_faqs_options[base-input][text-input]" 
                          id="text-input" 
                          value={settingData['base-input']['text-input']} 
                          onChange={(e) => onChange('base-input.text-input', e.target.value)} 
                          /> 
                        </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="email-input">Email Input</label>
                  </th>
                  <td>
                    <div className="position-relative input_email">
                      <label htmlFor="email-input">
                        <input 
                          type="email" 
                          name="mos_faqs_options[base-input][email-input]" 
                          id="email-input" 
                          value={settingData['base-input']['email-input']} 
                          onChange={(e) => onChange('base-input.email-input', e.target.value)}
                          /> 
                        </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="color-input">Color Input</label>
                  </th>
                  <td>
                    <div className="position-relative input_color">
                      <label htmlFor="color-input">
                        <input 
                          type="color" 
                          name="mos_faqs_options[base-input][color-input]" 
                          id="color-input" 
                          value={settingData['base-input']['color-input']} 
                          onChange={(e) => onChange('base-input.color-input', e.target.value)}
                          /> 
                        </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="date-input">Date Input</label>
                  </th>
                  <td>
                    <div className="position-relative input_date">
                      <label htmlFor="date-input">
                        <input 
                          type="date" 
                          name="mos_faqs_options[base-input][date-input]" 
                          id="date-input" 
                          value={settingData['base-input']['date-input']} 
                          onChange={(e) => onChange('base-input.date-input', e.target.value)}
                          /> 
                        </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="datetime-local-input">Datetime local Input</label>
                  </th>
                  <td>
                    <div className="position-relative input_datetime_local">
                      <label htmlFor="datetime-local-input">
                        <input 
                          type="datetime-local" 
                          name="mos_faqs_options[base-input][datetime-local-input]" 
                          id="datetime-local-input" 
                          value={settingData['base-input']['datetime-local-input']} 
                          onChange={(e) => onChange('base-input.datetime-local-input', e.target.value)}
                          /> 
                        </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="textarea-input">Textarea</label>
                  </th>
                  <td>
                    <div className="position-relative textarea">
                      <label htmlFor="textarea-input">
                        <textarea type="text" name="mos_faqs_options[base-input][textarea-input]" id="textarea-input" value={settingData['base-input']['textarea-input']} onChange={(e) => onChange('base-input.textarea-input', e.target.value)}/>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="switch-input">Enable Product Tabs</label>
                  </th>
                  <td>
                    <div className="position-relative mos-faqs-switcher">
                      <label htmlFor="mos_faqs_options_switch-input">
                        <input 
                          type="checkbox" 
                          name="mos_faqs_options[base-input][switch-input]" 
                          id="mos_faqs_options_switch-input" 
                          value="1" 
                          checked={settingData['base-input']['switch-input']} 
                          onChange={(e) => {onChange('base-input.switch-input', e.target.checked ? "1" : "0")}}
                          /> 
                        <em data-on="on" data-off="off"></em> 
                        <span></span> 
                      </label>
                        
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="radio-input">Radio Input</label>
                  </th>
                  <td>
                    <div className="position-relative radio">
                      <div className="radio-wrapper">
                        {options.map((optionObj, index) => {
                            const [value, label] = Object.entries(optionObj)[0];
                            return (
                              <div className="radio-unit" key={index}>
                                <input 
                                  className={`radio-input radio-input-${index}`} 
                                  name="mos_faqs_options[base-input][radio-input]" 
                                  id={`radio-input-${index}`} type="radio" 
                                  value={value}
                                  checked={settingData['base-input']['radio-input'] === value}
                                  onChange={(e) => {onChange('base-input.radio-input', e.target.value)}} 
                                />
                                <label htmlFor={`radio-input-${index}`}><span></span> {label}</label>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="datalist-input">Datalist Input</label>
                  </th>
                  <td>
                    <div className="position-relative datalist">
                      <label htmlFor="datalist-input">
                        <input 
                          list="mos_faqs_options_datalist-input" 
                          name="mos_faqs_options[base-input][datalist-input]" 
                          id="datalist-input" 
                          value={settingData['base-input']['datalist-input']}
                          onChange={(e) => {onChange('base-input.datalist-input', e.target.value)}}
                        /> 
                      </label>
                      <datalist id="mos_faqs_options_datalist-input">
                          {options_2.map((option, index) => (
                            <option key={index}>
                              {option}
                            </option>
                          ))}
                      </datalist>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="select-input">Select Input</label>
                  </th>
                  <td>
                    <div className="position-relative select">
                      <label htmlFor="select-input">
                        <select 
                          name="mos_faqs_options[base-input][select-input]" 
                          id="select-input"
                          value={settingData['base-input']['select-input']}
                          onChange={(e) => {onChange('base-input.select-input', e.target.value)}}
                        >
                          {options.map((optionObj, index) => {
                            const [value, label] = Object.entries(optionObj)[0];
                            return (
                              <option key={index} value={value}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="checkbox-input">Checkbox Input</label>
                  </th>
                  <td>
                    <div className="position-relative select">
                      <div className="checkbox-group" id="checkbox-input">
                        {options.map((optionObj, index) => {
                            const [value, label] = Object.entries(optionObj)[0];
                            return (
                              <div className="checkbox-unit" key={index}>
                                <label>
                                  <input 
                                    type="checkbox" 
                                    value={value} 
                                    name="mos_faqs_options[array-input][checkbox-input][]"
                                    id={`checkbox-input-${index}`}
                                    checked={settingData['array-input']['checkbox-input']?.includes(value) || false}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const newValue = checked
                                        ? [...(settingData['array-input']['checkbox-input'] || []), value]
                                        : settingData['array-input']['checkbox-input'].filter((v) => v !== value);
                                      onChange('array-input.checkbox-input', newValue);
                                    }}
                                    /> <span>{label}</span> 
                                  </label>
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="multi-select-input">Multi Select Input</label>
                  </th>
                  <td>
                    <div className="position-relative select">
                      <label htmlFor="multi-select-input">
                        <select 
                          name="mos_faqs_options[array-input][multi-select-input][]" 
                          id="multi-select-input" multiple=""
                          value={settingData['array-input']['multi-select-input'] || []}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            onChange('array-input.multi-select-input', selectedOptions);
                          }}
                          multiple="multiple"
                        >
                          {options.map((optionObj, index) => {
                            const [value, label] = Object.entries(optionObj)[0];
                            return (
                              <option key={index} value={value}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      </label>
                    </div>
                  </td>
                </tr>
                {/* <tr className="mos_faqs_row">
                  <th scope="row">
                    <label htmlFor="editor-input">Editor</label>
                  </th>
                  <td>
                      <div className="position-relative textarea">
                          
                      </div>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <p className="submit">
          <button 
            type="button" 
            className="button button-primary" 
            name="submit" 
            id="submit"
            onClick={handleSave}
            // onClick={() => {
            //   // Handle save logic here
            //   console.log("Save button clicked");
            //   console.log(settingData);
            // }}
            >Save Changes</button>
          <button 
            type="button" 
            className="button button-secondary" 
            data-name="all"
            onClick={handleResetAll}
          >Reset</button>
      </p>
      </> :
      <Loading />
    }
    {/* {console.log(settingData)}     */}
    </>
  );
}

export default App;