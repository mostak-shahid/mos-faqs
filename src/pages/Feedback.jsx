import { __ } from "@wordpress/i18n";
import Switch from '../components/Switch/Switch';
import { useMain } from '../contexts/MainContext';
import withForm from '../pages/withForm';
import axios from "axios";
import { useEffect, useState } from 'react';
const Feedback = () => {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [processing, setProcessing] = useState(false)
    const handleForm = async () => {
        if (subject && message) {
            setProcessing(true);
            try {
                const result = await axios.post(
                    "/wp-json/mos-faqs/v1/feedback",
                    {
                        subject: subject,
                        message: message
                    },
                    {
                        headers: {
                            'X-WP-Nonce': mos_faqs_ajax_obj.api_nonce,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                // You might want to handle success here
                // console.log("Mail sent successfully:", result.data);
            } catch (error) {
                console.error("Mail Sending Error:", error);
            } finally {
                setProcessing(false);
            }
        } else {
            alert('Subject or Message can\'t be Empty')
        }
    };
    return (
        <>
            <div className="setting-unit">
                <div className="row align-items-center">
                    <div className="col-lg-6">
                        <img className="img-fluid" src={`${mos_faqs_ajax_obj.image_url}feedback.jpg`} alt="" />
                    </div> 
                    <div className="col-lg-6">
                        <div class="mb-3">
                            <label htmlFor="subject" class="form-label">{__("Subject", "mos-faqs")}</label>
                            <input 
                                id="subject"
                                className="form-control"
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            /> 
                        </div>
                        <div class="mb-3">
                            <label htmlFor="message" class="form-label">{__("Message", "mos-faqs")}</label>
                            <textarea 
                                id="message"
                                className="form-control"
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            /> 
                        </div>
                        <button 
                            type="button" 
                            className="button button-primary" 
                            onClick={handleForm}
                            disabled={processing}
                        >
                            {
                                processing ? __( "Sending...", "mos-faqs" ) : __( "Send", "mos-faqs" )
                            }
                        </button>
                        
                    </div>  
                </div>
            </div>
        </>
    )
}
export default withForm(Feedback);