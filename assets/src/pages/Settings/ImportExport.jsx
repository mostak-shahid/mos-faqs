import { __ } from "@wordpress/i18n";
import apiFetch from '@wordpress/api-fetch';
import { useState } from 'react';
import { Row, Col, Typography, Skeleton, Button, Upload, Space, Notification } from '@douyinfe/semi-ui';
import { IconDownload, IconUpload, IconTickCircle } from '@douyinfe/semi-icons';
import { SkeletonPlaceholder } from '../../components';

const { Title, Paragraph } = Typography;

const ImportExport = () => {
    const { Title, Text, Paragraph } = Typography;
    const [importData, setImportData] = useState('');
    const [processingImport, setProcessingImport] = useState(false);
    const [processingExport, setProcessingExport] = useState(false);
    const [fileList, setFileList] = useState([]);

    const handleExport = async() => {
        setProcessingExport(true);
        try {
            const data = await apiFetch({
                path: "/mos-faqs/v1/options",
                method: 'GET'
            });
            if (data) {
                // setSettings(data);
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'mos-faqs-settings.json';
                link.click();
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setProcessingExport(false);
        }        
        // toast.success(__('Settings exported successfully', 'mos-faqs'));
    };
    

    // Handle file upload with Semi Design Upload
    const handleFileChange = ({ fileList, currentFile }) => {
        setFileList(fileList);
        
        if (currentFile && currentFile.fileInstance) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target.result;
                    JSON.parse(content); // Validate JSON
                    setImportData(content);
                    // toast.success(__('File loaded successfully', 'mos-faqs'));
                } catch (err) {
                    // toast.error(__('Invalid JSON file', 'mos-faqs'));
                    setFileList([]);
                    setImportData('');
                }
            };
            reader.readAsText(currentFile.fileInstance);
        }
    };

    // Handle file removal
    const handleRemove = () => {
        setImportData('');
        setFileList([]);
    };

    // Submit imported JSON
    const handleImport = async () => {
        setProcessingImport(true);
        console.log(importData);
        try {
            const parsed = JSON.parse(importData);
            const response = await apiFetch({
                path: '/mos-faqs/v1/options/import-settings',
                method: 'POST',
                data: parsed,
            });

            if (response.success) {
                setProcessingImport(false);
                setFileList([]);
                setImportData('');
                Notification.success({
                    title: __("Success", "mos-faqs"),
                    content: __("Settings imported successfully!", "mos-faqs"),
                    duration: 3,
                    position: 'topRight',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                // toast.error(__('Import failed', 'mos-faqs'));
                setProcessingImport(false);
            }
        } catch (e) {
            // toast.error(__('Invalid JSON content', 'mos-faqs'));
            console.log(e);
            setProcessingImport(false);
        } finally {
            setProcessingImport(false);
        }
    };
    return (
        <>
            <div className="setting-unit py-4">
                <Row type="flex" gutter={[24, 24 ]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Title heading={4}>{__("Export Settings", "mos-faqs")}</Title>
                        <Paragraph>{__("Export your current settings", "mos-faqs")}</Paragraph>
                    </Col>                                 
                    <Col xs={24} lg={12} xl={10}>
                        <Button     
                            type="primary" 
                            icon={<IconDownload />}                  
                            onClick={handleExport}
                        >
                            {__( "Export Settings", "mos-faqs" )}
                        </Button>
                    </Col>
                </Row>
            </div>
            
            <div className="setting-unit pt-4">
                <Row type="flex" gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                            <Title heading={4}>{__("Import Settings", "mos-faqs")}</Title>
                            <Paragraph>{__("Description", "mos-faqs")}</Paragraph>
                    </Col>                                 
                    <Col xs={24} lg={12} xl={10}>
                        <Space vertical spacing='tight' align='start'>
                            <Upload
                                accept="application/json,.json"
                                action=""
                                fileList={fileList}
                                onChange={handleFileChange}
                                onRemove={handleRemove}
                                beforeUpload={() => false}
                                maxSize={5120}
                                limit={1}
                            >
                                <Button icon={<IconUpload />}>
                                    {__("Select JSON File", "mos-faqs")}
                                </Button>
                            </Upload>
                            {importData &&
                                <Button
                                    icon={ !processingImport ? <IconTickCircle /> : null}
                                    onClick={handleImport}
                                    disabled={processingImport}
                                    loading={processingImport}
                                    type="primary"
                                >
                                    {processingImport
                                        ? __("Processing...", "mos-faqs")
                                        : __("Import Settings", "mos-faqs")
                                    }
                                </Button>
                            }
                        </Space>
                        <div>

                            {/* Hidden textarea with the JSON content */}
                            <textarea
                                style={{ display: 'none' }}
                                value={importData}
                                readOnly
                            ></textarea>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ImportExport;