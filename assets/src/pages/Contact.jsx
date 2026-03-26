import { __ } from "@wordpress/i18n";
import { useState } from 'react';
import {BoxedLayout} from '../layouts';
import { Card, Input, TextArea, Button, Notification } from '@douyinfe/semi-ui';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = () => {
        // In a real app, you'd save to backend
        console.log('Form submitted:', formData);
        Notification.success({
            title: __("Success", "mos-faqs"),
            content: __("Contact form submitted successfully!", "mos-faqs"),
            duration: 3,
            position: 'topRight',
        });
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const sidebar = (
        <div style={{ padding: '24px' }}>
            <h3>Contact Details</h3>
            <div style={{ marginTop: '16px' }}>
                <p><strong>Phone:</strong></p>
                <p>+1 234 567 8900</p>
                <p style={{ marginTop: '16px' }}><strong>Email:</strong></p>
                <p>contact@example.com</p>
                <p style={{ marginTop: '16px' }}><strong>Address:</strong></p>
                <p>123 Main Street<br/>City, State 12345</p>
            </div>
        </div>
    );

    return (
        <BoxedLayout sidebar={sidebar} sidebarPosition='right'>
            <Card title="Contact Us">
                <div style={{ maxWidth: '500px' }}>
                    <Input 
                        value={formData.name}
                        onChange={(value) => handleFieldChange('name', value)}
                        label="Name" 
                        placeholder="Enter your name" 
                    />
                    <div style={{ marginBottom: '16px' }} />
                    <Input 
                        value={formData.email}
                        onChange={(value) => handleFieldChange('email', value)}
                        label="Email" 
                        placeholder="Enter your email"
                    />
                    <div style={{ marginBottom: '16px' }} />
                    <TextArea 
                        value={formData.message}
                        onChange={(value) => handleFieldChange('message', value)}
                        label="Message" 
                        placeholder="Enter your message" 
                        rows={4}
                    />
                    <div style={{ marginBottom: '16px' }} />
                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                </div>
            </Card>
        </BoxedLayout>
    );
};

export default Contact;