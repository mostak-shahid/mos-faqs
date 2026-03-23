import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import {
    Row,
    Col,
    Skeleton,
    Button,
    Typography,
    Toast,
    Switch,
    Select,
} from "@douyinfe/semi-ui";
import { IconRefresh, IconCopy } from "@douyinfe/semi-icons";
import { useOutletContext } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { SkeletonPlaceholder } from "../../components";
import ActionButtons from "./ActionButtons";

const { Title, Paragraph } = Typography;

/* ----------------------------------
   Clipboard helper with fallback
----------------------------------- */
const copyToClipboard = (value) => {
    if (!value) {
        Toast.error("No text to copy");
        return;
    }

    // Modern approach - works in HTTPS and localhost
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value)
            .then(() => {
                Toast.success("Copied to clipboard");
            })
            .catch((err) => {
                console.error("Clipboard API failed:", err);
                fallbackCopyToClipboard(value);
            });
    } else {
        // Fallback for older browsers or non-HTTPS contexts
        fallbackCopyToClipboard(value);
    }
};

/* ----------------------------------
   Fallback clipboard method
----------------------------------- */
const fallbackCopyToClipboard = (value) => {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    
    // Make it invisible
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            Toast.success("Copied to clipboard");
        } else {
            Toast.error("Failed to copy");
        }
    } catch (err) {
        console.error("Fallback copy failed:", err);
        Toast.error("Copy not supported in this browser");
    } finally {
        document.body.removeChild(textArea);
    }
};

const Tools = () => {
    const {
        settings,
        settingsLoading,
        handleSubmit,
        handleReset,
        setSettingsReload,
    } = useOutletContext();

    const [hasChanges, setHasChanges] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [deactivationUrl, setDeactivationUrl] = useState("");
    const [deactivationLoading, setDeactivationLoading] = useState(true);
    const [deactivationError, setDeactivationError] = useState(null);
    
    const [formData, setFormData] = useState({
        hide_plugin: false,
        self_defense: false,
        delete_data_on: 'none'
    });
    const settingsOld = useRef(null);
    
    /* ----------------------------------
       Fetch deactivation link
    ----------------------------------- */
    // useEffect(() => {
    //     const fetchDeactiveLink = async () => {
    //         setDeactivationLoading(true);
    //         setDeactivationError(null);
            
    //         try {
    //             const response = await apiFetch({ 
    //                 path: `/mos-faqs/v1/deactivation-link` 
    //             });
                
    //             if (response.success && response.deactivation_url) {
    //                 setDeactivationUrl(response.deactivation_url);
                    
    //                 // Set the URL in the form
    //                 formApi.current?.setValue("deactivation_url", response.deactivation_url);
    //             } else {
    //                 throw new Error(response.message || "Failed to fetch deactivation URL");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching deactivation link:", error);
    //             setDeactivationError(error.message || "Failed to load deactivation URL");
                
    //             Toast.error({
    //                 content: __("Error fetching deactivation URL", "mos-faqs"),
    //                 theme: "light",
    //             });
    //         } finally {
    //             setDeactivationLoading(false);
    //         }
    //     };
        
    //     // Only fetch if form API is ready
    //     if (formApi.current) {
    //         fetchDeactiveLink();
    //     }
    // }, [settings]); // Re-fetch when settings change

    /* ----------------------------------
       Submit
     ----------------------------------- */
    const onSubmit = () => {
        handleSubmit("tools", formData);
    };

    /* ----------------------------------
       Detect changes
     ----------------------------------- */
    const handleFieldChange = (field, value) => {
        setFormData(prev => {
            const newFormData = { ...prev, [field]: value };
            if (settingsOld.current?.tools) {
                const isChanged =
                    JSON.stringify(newFormData) !==
                    JSON.stringify(settingsOld.current.tools);
                setHasChanges(isChanged);
            }
            return newFormData;
        });
    };

    /* ----------------------------------
       Sync form when settings load
     ----------------------------------- */
    useEffect(() => {
        if (settings?.tools) {
            settingsOld.current = { ...settings };
            setFormData({
                hide_plugin: settings.tools.hide_plugin || false,
                self_defense: settings.tools.self_defense || false,
                delete_data_on: settings.tools.delete_data_on || 'none'
            });
            setHasChanges(false);
        }
    }, [settings]);

    /* ----------------------------------
       Reset handler
    ----------------------------------- */
    const handleClick = async () => {
        const confirmation = window.confirm(
            __("Are you sure you want to proceed?", "mos-faqs")
        );

        if (!confirmation) return;

        setProcessing(true);

        try {
            const result = await apiFetch({
                path: "/mos-faqs/v1/options/reset-settings-all",
                method: "POST",
            });

            if (result.success) {
                Toast.success({
                    content: __("Settings reset successfully!", "mos-faqs"),
                    theme: "light",
                });
            } else {
                throw new Error("Reset failed");
            }
        } catch (error) {
            Toast.error({
                content: __("Error resetting settings.", "mos-faqs"),
                theme: "light",
            });
        } finally {
            setProcessing(false);
            setSettingsReload?.(Math.random());
        }
    };

    return (
        <>
            {/* -------------------------
                Hide Plugin section
            -------------------------- */}
            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={settingsLoading}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Hide Plugin",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Paragraph>
                                {__(
                                    "Hide this plugin from plugin list.",
                                    "mos-faqs"
                                )}
                            </Paragraph>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Switch 
                            checked={formData.hide_plugin}
                            onChange={(checked) => handleFieldChange('hide_plugin', checked)}
                        />
                    </Col>
                </Row>
            </div>
            {/* -------------------------
                Self Defense section
            -------------------------- */}
            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={settingsLoading}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Self Defense",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Paragraph>
                                {__(
                                    "Password requirement for Deactivation.",
                                    "mos-faqs"
                                )}
                            </Paragraph>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Switch 
                            checked={formData.self_defense}
                            onChange={(checked) => handleFieldChange('self_defense', checked)}
                        />
                    </Col>
                </Row>
            </div>
            {/* -------------------------
                Delete data section
            -------------------------- */}
            <div className="setting-unit py-4">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={12} xl={14}>
                        <Skeleton
                            placeholder={<SkeletonPlaceholder />}
                            loading={settingsLoading}
                            active
                        >
                            <Title heading={4}>
                                {__(
                                    "Delete all the plugin data upon",
                                    "mos-faqs"
                                )}
                            </Title>
                            <Paragraph>
                                {__(
                                    "Plugin data management.",
                                    "mos-faqs"
                                )}
                            </Paragraph>
                        </Skeleton>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Select
                            value={formData.delete_data_on}
                            onChange={(value) => handleFieldChange('delete_data_on', value)}
                            optionList={[
                                { label: __("None", "mos-faqs"), value: "none" },
                                { label: __("Delete", "mos-faqs"), value: "delete" },
                                { label: __("Deactivate", "mos-faqs"), value: "deactivate" },
                            ]}
                        />
                    </Col>
                </Row>
            </div>

            {/* -------------------------
                Reset section
            -------------------------- */}
            <div className="setting-unit pt-4">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} lg={12} xl={14}>
                        <Title heading={4}>
                            {__("Reset Plugin", "mos-faqs")}
                        </Title>
                        <Paragraph>
                            {__("Reset Plugin to it's default settings", "mos-faqs")}
                        </Paragraph>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Button
                            type="danger"
                            icon={<IconRefresh />}
                            loading={processing}
                            onClick={handleClick}
                        >
                            {processing
                                ? __("Resetting...", "mos-faqs")
                                : __("Reset All", "mos-faqs")}
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* -------------------------
                Deactivate Plugin URL section
            -------------------------- */}
            {/* <div className="setting-unit pt-4">
                <Row gutter={[24, 24]} align="middle">
                    <Col xs={24} lg={12} xl={14}>
                        <Title heading={4}>
                            {__("Deactivate Plugin URL", "mos-faqs")}
                        </Title>
                        <Paragraph>
                            {deactivationError 
                                ? deactivationError
                                : __("Use this secure URL to deactivate the plugin. This link will only work once.", "mos-faqs")
                            }
                        </Paragraph>
                    </Col>

                    <Col xs={24} lg={12} xl={10}>
                        <Input
                            readOnly
                            disabled={deactivationLoading || !!deactivationError}
                            placeholder={
                                deactivationLoading 
                                    ? __("Loading...", "mos-faqs")
                                    : deactivationError
                                    ? __("Failed to load URL", "mos-faqs")
                                    : __("Deactivation URL", "mos-faqs")
                            }
                            suffix={
                                <Button
                                    theme="borderless"
                                    icon={<IconCopy />}
                                    disabled={deactivationLoading || !!deactivationError || !deactivationUrl}
                                    onClick={() =>
                                        copyToClipboard(
                                            formData.deactivation_url
                                        )
                                    }
                                />
                            }
                        />
                    </Col>
                </Row>
            </div> */}

            {/* -------------------------
                Save / Reset buttons
            -------------------------- */}
            <ActionButtons
                hasChanges={hasChanges}
                section="tools"
                handleReset={handleReset}
                handleSubmit={onSubmit}
            />
        </>
    );
};

export default Tools;