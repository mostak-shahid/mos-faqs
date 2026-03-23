import { __ } from "@wordpress/i18n";
import { Row, Col, Skeleton, Typography, Radio } from '@douyinfe/semi-ui';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder } from "../../components";

const { Title, Paragraph } = Typography;
const BasicInputs = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const settingsOld = useRef(null);
    
    const [formData, setFormData] = useState({
        text: '',
        textarea: '',
        radio: 'radio-1'
    });

    const onSubmit = () => {
        handleSubmit('basic', formData);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            if (settingsOld.current?.basic) {
                const isChanged = JSON.stringify(newFormData) !== JSON.stringify(settingsOld.current.basic);
                setHasChanges(isChanged);
            }
            return newFormData;
        });
    };

    useEffect(() => {
        if (settings && settings.basic) {
            settingsOld.current = { ...settings };
            setFormData({
                text: settings.basic.text || '',
                textarea: settings.basic.textarea || '',
                radio: settings.basic.radio || 'radio-1'
            });
            setHasChanges(false);
        }
    }, [settings]);

    return (
        <>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Text Input", "mos-faqs")}</Title>
                            <Paragraph>{__("Lorem", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <input
                                type="text"
                                value={formData.text}
                                onChange={(e) => handleFieldChange('text', e.target.value)}
                                placeholder={__("Enter text", "mos-faqs")}
                                style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                            /> 
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Text Area", "mos-faqs")}</Title>
                            <Paragraph>{__("Lorem", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <textarea
                                value={formData.textarea}
                                onChange={(e) => handleFieldChange('textarea', e.target.value)}
                                placeholder={__("Enter textarea content", "mos-faqs")}
                                rows={4}
                                style={{ width: '100%', padding: '8px', border: '1px solid #d9d9d9', borderRadius: '4px' }}
                            />
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Radio Group", "mos-faqs")}</Title>
                            <Paragraph>{__("Lorem", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <Radio.Group
                                value={formData.radio}
                                onChange={(e) => handleFieldChange('radio', e.target.value)}
                                type="button"
                            >
                                <Radio value="radio-1">{__('Radio 1', 'mos-faqs')}</Radio>
                                <Radio value="radio-2">{__('Radio 2', 'mos-faqs')}</Radio>
                                <Radio value="radio-3">{__('Radio 3', 'mos-faqs')}</Radio>
                            </Radio.Group>
                        </Col>
                    }
                </Row>
            </div>
            <ActionButtons hasChanges={hasChanges} section='basic' handleReset={handleReset} handleSubmit={onSubmit} />
        </>
    );
};

export default BasicInputs;