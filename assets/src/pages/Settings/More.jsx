import { __ } from "@wordpress/i18n";
import { Button, Card, Typography, Row, Col, Skeleton, Switch } from '@douyinfe/semi-ui';
import { useOutletContext } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import ActionButtons from "./ActionButtons";
import { SkeletonPlaceholder } from "../../components";

import AceEditor from "react-ace";
// Load modes and theme
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const { Title, Paragraph } = Typography;

const More = () => {
    const { settings, settingsLoading, handleSubmit, handleReset } = useOutletContext();
    const [hasChanges, setHasChanges] = useState(false);
    const settingsOld = useRef(null);
    
    const [formData, setFormData] = useState({
        enable_scripts: false,
        css: '',
        js: '',
        header_content: '',
        footer_content: ''
    });

    const onSubmit = () => {
        handleSubmit('more', formData);
    };

    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            if (settingsOld.current?.more) {
                const isChanged = JSON.stringify(newFormData) !== JSON.stringify(settingsOld.current.more);
                setHasChanges(isChanged);
            }
            return newFormData;
        });
    };

    const handleAceEditorChange = (field, value) => {
        handleFieldChange(field, value);
    };

    useEffect(() => {
        if (settings && settings.more) {
            settingsOld.current = { ...settings };
            setFormData({
                enable_scripts: settings.more.enable_scripts || false,
                css: settings.more.css || '',
                js: settings.more.js || '',
                header_content: settings.more.header_content || '',
                footer_content: settings.more.footer_content || ''
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
                            <Title heading={4}>{__("Enable Scripts", "mos-faqs")}</Title>
                            <Paragraph>{__("Enable/Disable \"Scripts\" functionalities", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24} lg={12} xl={10}>
                            <Switch 
                                checked={formData.enable_scripts}
                                onChange={(checked) => handleFieldChange('enable_scripts', checked)}
                            />   
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("CSS Editor", "mos-faqs")}</Title>
                            <Paragraph>{__("Add any custom CSS code if necessary", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24}>
                            <AceEditor
                                mode="css"
                                theme="monokai"
                                value={formData.css}
                                onChange={(value) => handleAceEditorChange('css', value)}
                                name="css-editor"
                                width="100%"
                                height="200px"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("JavaScript Editor", "mos-faqs")}</Title>
                            <Paragraph>{__("Add any custom JS code if necessary", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24}>
                            <AceEditor
                                mode="javascript"
                                theme="monokai"
                                value={formData.js}
                                onChange={(value) => handleAceEditorChange('js', value)}
                                name="js-editor"
                                width="100%"
                                height="200px"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Header Code", "mos-faqs")}</Title>
                            <Paragraph>{__("This code will be placed inside &lt;head&gt; tag", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24}>
                            <AceEditor
                                mode="html"
                                theme="monokai"
                                value={formData.header_content}
                                onChange={(value) => handleAceEditorChange('header_content', value)}
                                name="html-editor-1"
                                width="100%"
                                height="200px"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <div className="setting-unit pt-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton placeholder={<SkeletonPlaceholder />} loading={settingsLoading} active>
                            <Title heading={4}>{__("Footer Code", "mos-faqs")}</Title>
                            <Paragraph>{__("This code will be placed inside &lt;body&gt; tag", "mos-faqs")}</Paragraph>
                        </Skeleton>
                    </Col>    
                    {
                        !settingsLoading &&                               
                        <Col xs={24}>
                            <AceEditor
                                mode="html"
                                theme="monokai"
                                value={formData.footer_content}
                                onChange={(value) => handleAceEditorChange('footer_content', value)}
                                name="html-editor-2"
                                width="100%"
                                height="200px"
                                editorProps={{ $blockScrolling: true }}
                            />
                        </Col>
                    }
                </Row>
            </div>

            <ActionButtons hasChanges={hasChanges} section='more' handleReset={handleReset} handleSubmit={onSubmit} />
        </>
    );
};

export default More;