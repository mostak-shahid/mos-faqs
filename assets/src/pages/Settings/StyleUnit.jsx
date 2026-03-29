import { __ } from "@wordpress/i18n";
import { Row, Col, Skeleton, Typography, Radio, Input } from '@douyinfe/semi-ui';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder, BackgroundControl, BoxShadowControl, ColorPickerControl, FontControl, MediaUploaderControl, MultiColorControl, TextShadowControl, UnitControl, BorderControl } from "../../components";
// import { BorderControl } from '@wordpress/components';
import { BorderBoxControl, BoxControl } from '@wordpress/components';

const { Title, Paragraph } = Typography;
const StyleUnit = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const settingsOld = useRef(null);
    
    const [formData, setFormData] = useState({
        background: {},
        color: {},
        border: {},
        padding: '',
        margin: '',
        boxshadow: {
            enabled: false,
            inset: false,
        },
    });

    const onSubmit = () => {
        handleSubmit('style.unit', formData);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            if (settingsOld.current?.style?.unit) {
                const isChanged = JSON.stringify(newFormData) !== JSON.stringify(settingsOld.current.style.unit);
                setHasChanges(isChanged);
            }
            return newFormData;
        });
    };

    useEffect(() => {
        if (settings && settings.style && settings.style.unit) {
            settingsOld.current = { ...settings };
            setFormData({
                background: settings.style.unit.background || {},
                color: settings.style.unit.color || {},
                border: settings.style.unit.border || {},
                padding: settings.style.unit.padding || '',
                margin: settings.style.unit.margin || '',
                boxshadow: settings.style.unit.boxshadow || {
                    enabled: false,
                    inset: false,
                },
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
                            <Title heading={4}>{__("Background", "mos-faqs")}</Title>
                            <Paragraph>{__("Pick a background color", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <MultiColorControl
                                options={["primary", "hover", "active"]}
                                defaultValues={formData.background}
                                name="background"
                                handleChange={handleFieldChange}
                            />
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("color", "mos-faqs")}</Title>
                            <Paragraph>{__("Pick a text color", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <MultiColorControl
                                options={["primary", "hover", "active"]}
                                defaultValues={formData.color}
                                name="color"
                                handleChange={handleFieldChange}
                            />
                        </Col>
                    }
                </Row>
            </div>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Border", "mos-faqs")}</Title>
                            <Paragraph>{__("Set border settings", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            {/* <Input
                                value={formData.border}
                                onChange={handleFieldChange}
                            /> */}
                            <BorderControl
                                onChange={ handleFieldChange }
                                value={ formData.border }
                            />
                            <BorderBoxControl
                                __next40pxDefaultSize
                                enableStyle={true}
                                // colors={ colors }
                                label={ __( 'Borders' ) }
                                onChange={ handleFieldChange }
                                value={ formData.border }
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Padding", "mos-faqs")}</Title>
                            <Paragraph>{__("Set padding values", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <UnitControl
                                label={__("Padding", "mos-faqs")}
                                value={formData.padding}
                                onChange={(value) => handleFieldChange('padding', value)}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: '%', label: '%' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                                min={0}
                                step={1}
                            />
                            <BoxControl
                                __next40pxDefaultSize
                                values={ formData.padding }
                                onChange={(value) => handleFieldChange('padding', value)}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Margin", "mos-faqs")}</Title>
                            <Paragraph>{__("Set margin values", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <UnitControl
                                label={__("Margin", "mos-faqs")}
                                value={formData.margin}
                                onChange={(value) => handleFieldChange('margin', value)}
                                units={[
                                    { value: 'px', label: 'px' },
                                    { value: '%', label: '%' },
                                    { value: 'em', label: 'em' },
                                    { value: 'rem', label: 'rem' },
                                ]}
                                min={0}
                                step={1}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Box Shadow", "mos-faqs")}</Title>
                            <Paragraph>{__("Set box shadow values", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <BoxShadowControl
                                value={formData.boxshadow}
                                onChange={(value) => handleFieldChange('boxshadow', value)}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <ActionButtons hasChanges={hasChanges} section='style.unit' handleReset={handleReset} handleSubmit={onSubmit} />
        </>
    );
};

export default StyleUnit;