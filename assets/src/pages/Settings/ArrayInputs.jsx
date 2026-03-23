import { __ } from "@wordpress/i18n";
import { Row, Col, Skeleton, Typography, Checkbox } from '@douyinfe/semi-ui';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder } from "../../components";
const { Title, Paragraph } = Typography;
const ArrayInputs = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const settingsOld = useRef(null);
    
    const [formData, setFormData] = useState({
        checkbox: []
    });

    const onSubmit = () => {
        handleSubmit('array', formData);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            if (settingsOld.current?.array) {
                const isChanged = JSON.stringify(newFormData) !== JSON.stringify(settingsOld.current.array);
                setHasChanges(isChanged);
            }
            return newFormData;
        });
    };

    useEffect(() => {
        if (settings && settings.array) {
            settingsOld.current = { ...settings };
            setFormData({
                checkbox: settings.array.checkbox || []
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
                            <Title heading={4}>{__("Checkbox Group", "mos-faqs")}</Title>
                            <Paragraph>{__("Lorem", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <Checkbox.Group
                                value={formData.checkbox}
                                onChange={(value) => handleFieldChange('checkbox', value)}
                                direction="vertical"
                            >
                                <Checkbox value="checkbox-1">{__('Checkbox 1', 'mos-faqs')}</Checkbox>
                                <Checkbox value="checkbox-2">{__('Checkbox 2', 'mos-faqs')}</Checkbox>
                                <Checkbox value="checkbox-3">{__('Checkbox 3', 'mos-faqs')}</Checkbox>
                                <Checkbox value="checkbox-4">{__('Checkbox 4', 'mos-faqs')}</Checkbox>
                            </Checkbox.Group>
                        </Col>
                    }
                </Row>
            </div>
            
            <ActionButtons hasChanges={hasChanges} section='array' handleReset={handleReset} handleSubmit={onSubmit} />
        </>
    );
};

export default ArrayInputs;