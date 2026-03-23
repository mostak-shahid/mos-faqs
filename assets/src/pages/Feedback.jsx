import { useEffect, useState } from 'react';
import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { Card, Input, TextArea, Button, Col, Row, Typography, Notification, Space } from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';
import {OnlineSurvey, OnlineSurveyDark} from '../lib/Illustrations';
import { BoxedLayout } from '../layouts';
import { PageInfo } from '../components';
import menuItems from '../data/menu.json';
const Feedback = () => {    
    const [formData, setFormData] = useState({
        subject: '',
        email: '',
        phone: '',
        message: '',
    });
    const [processing, setProcessing] = useState(false);

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleForm = async () => {
        console.log(formData);
        if (formData.subject && formData.message) {
            setProcessing(true);
            try {
                const result = await apiFetch({
                    path: "/mos-faqs/v1/feedback",
                    method: "POST",
                    data: {
                        subject: formData.subject,
                        email: formData.email,
                        phone: formData.phone,
                        message: formData.message
                    },
                    headers: {
                        'X-WP-Nonce': mos_faqs_ajax_obj.api_nonce
                    }
                });
                console.log(result);
                if (result.success) {
                    setFormData({
                        subject: '',
                        email: '',
                        phone: '',
                        message: '',
                    });
                    Notification.success({
                        title: __("Success", "mos-faqs"),
                        content: __("Feedback send successfully!", "mos-faqs"),
                        duration: 3,
                    });
                }

            } catch (error) {
                console.error("Mail Sending Error:", error);
                Notification.error({
                    title: __("Error", "mos-faqs"),
                    content: __("Please try again!", "mos-faqs"),
                    duration: 3,
                });
            } finally {
                setProcessing(false);
            }
        } else {
            Notification.warning({
                title: __("Warning", "mos-faqs"),
                content: __("Subject or Message can't be Empty", "mos-faqs"),
                duration: 3,
            });
        }
    };

    return (
        <BoxedLayout>
            <Card 
                    title={
                        <PageInfo menu={menuItems} url="/feedback"  />
                    }
                    // title="Title"
                    headerLine={true}
                >
                <Row type="flex" gutter={[24,24]} align="middle">
                    <Col sx={24} lg={12}>
                        <OnlineSurvey/>
                        {/* <IllustrationControl
                            image={<OnlineSurvey style={{ width: 530, height: 530 }} />}
                            darkModeImage={<OnlineSurveyDark style={{ width: 530, height: 530 }} />}
                        /> */}
                    </Col> 
                    <Col sx={24} lg={12}>
                        <div>
                            <div className="mb-3">
                                <Input                                
                                    label={__("Subject", "mos-faqs")}
                                    value={formData.subject}
                                    onChange={(value) => handleFieldChange('subject', value)}
                                    placeholder={__("Subject", "mos-faqs")}
                                />
                            </div>
                            <div className="mb-3">
                                <Input                                
                                    label={__("Email", "mos-faqs")}
                                    value={formData.email}
                                    onChange={(value) => handleFieldChange('email', value)}
                                    placeholder={__("Email", "mos-faqs")}
                                />
                            </div>
                            <div className="mb-3">
                                <Input                                
                                    label={__("Phone", "mos-faqs")}
                                    value={formData.phone}
                                    onChange={(value) => handleFieldChange('phone', value)}
                                    placeholder={__("Phone", "mos-faqs")}
                                />
                            </div>
                            <div className="mb-3">
                                <TextArea
                                    label={__("Message", "mos-faqs")}
                                    value={formData.message}
                                    onChange={(value) => handleFieldChange('message', value)}
                                    placeholder={__("Message", "mos-faqs")}
                                    rows={4}
                                />
                            </div>
                            <Space>
                                <Button 
                                    theme="solid" 
                                    type="primary" 
                                    onClick={handleForm}
                                    loading={processing}
                                >
                                    {__("Send", "mos-faqs")}
                                </Button>

                            </Space>
                            
                        </div>
                        {/* <Button 
                            theme="solid"
                            type="primary"
                            icon={<IconSend />}
                            loading={processing} 
                            onClick={handleForm} 
                            style={{ marginRight: 14 }}
                        >                                
                            {
                                processing ? __( "Sending...", "mos-faqs" ) : __( "Send", "mos-faqs" )
                            }
                        </Button> */}
                        
                    </Col>  
                </Row>
            </Card>
        </BoxedLayout>
    );
};

export default Feedback;