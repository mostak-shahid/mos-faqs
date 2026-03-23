import React, { useState, useEffect, Suspense  } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";

import { Layout, Typography, Banner, Space, Badge, Button, SideSheet, Col, Row, Tag, Modal, Card} from '@douyinfe/semi-ui';
import { IconStar, IconSetting, IconHome, IconMember, IconBookStroked, IconHelpCircleStroked, IconBellStroked, IconSun, IconMoon, IconTemplate,IconCustomerSupport, IconFile, } from '@douyinfe/semi-icons';
import { LocaleProvider } from '@douyinfe/semi-ui';
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";

import { Dashboard, Settings, ImportExport, More, Tools, Logs, LogsCharts, LogsTable, Feedback, FreeVsPro, NotFound} from './pages';

import {
    About, 
    Contact,
    BasicInputs, 
    ArrayInputs,
    BoxedLeftSidebar,
    BoxedNoSidebar,
    BoxedRightSidebar,
    FullWidthLeftSidebar,
    FullWidthNoSidebar,
    FullWidthRightSidebar,
} from './pages';
import Page from './pages/Page';

import {HorizontalMenuControl} from "./components";
import { Logo } from './lib/Illustrations';
import Details from './data/details.json';

const year = new Date().getFullYear();
const { Header, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

export default function App() {
    const [darkmode, setDarkmode] = useState(false);

    const [newsVisible, setNewsVisible] = useState(false);
    const [newsItems, setNewsItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeNews, setActiveNews] = useState(null);
    const [readNewsIds, setReadNewsIds] = useState([]);
    const [newsCurrentPage, setNewsCurrentPage] = useState(1);
    const itemsPerPage = 5;
    useEffect(() => {
        const fetchSettingTheme = async () => {
            try {
                const params = new URLSearchParams({
                    id: mos_faqs_ajax_obj.get_current_user_id,
                });
                const theme = await apiFetch({
                    path: `/mos-faqs/v1/get-settings-theme?${params.toString()}`,
                    method: 'GET'
                });      

                // console.log('Theme received:', theme);
                document.body.setAttribute('theme-mode', theme);

                const isDark = theme === 'dark' || theme.value === 'dark';
                setDarkmode(isDark);
            } catch (err) {
                console.error('API error:', err);
            }
        };

        fetchSettingTheme();
    }, []); 
    const switchingMode = async () => {
        const switchMode = !darkmode;
        setDarkmode(switchMode);
        try {
            const params = new URLSearchParams({
                id: mos_faqs_ajax_obj.get_current_user_id,
                settings_theme: switchMode ? 'dark' : 'light',
            });

            const response = await apiFetch({
                path: `/mos-faqs/v1/set-settings-theme?${params.toString()}`,
                // method: 'GET'
            });
            if (response.success) {
                document.body.setAttribute('theme-mode', switchMode?'dark':'light');
            }
            console.log(response);
        } catch (error) {
            console.error("Error fetching settings data:", error);
        }
    };

    const truncateText = (text, wordLimit = 15) => {
        const words = text.split(/\s+/);
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const markNewsAsRead = async (newsId) => {
        if (!readNewsIds.includes(newsId)) {
            const updatedReadIds = [...readNewsIds, newsId];
            setReadNewsIds(updatedReadIds);
            try {
                await apiFetch({
                    path: '/mos-faqs/v1/set-option',
                    method: 'POST',
                    data: {
                        option_name: 'mospress_read_news',
                        option_value: updatedReadIds
                    }
                });
            } catch (error) {
                console.error("Error saving read news:", error);
            }
        }
    };

    // useEffect(() => {
    //     const fetchNews = async () => {
    //         try {
    //             const response = await fetch('https://raw.githubusercontent.com/mostak-shahid/update/refs/heads/master/plugin-news.json');
    //             const data = await response.json();
    //             setNewsItems(data);
    //         } catch (error) {
    //             console.error("Error fetching news:", error);
    //         }
    //     };
    //     fetchNews();

    //     const fetchReadNews = async () => {
    //         try {
    //             const response = await apiFetch({
    //                 path: '/mos-faqs/v1/get-option?option_name=mospress_read_news',
    //                 method: 'GET'
    //             });
    //             if (response && Array.isArray(response)) {
    //                 setReadNewsIds(response);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching read news:", error);
    //         }
    //     };
    //     fetchReadNews();
    // }, []); 

    const handleNewsVisible = (visible) => {
        setNewsVisible(visible);
        if (visible) {
            setNewsCurrentPage(1);
        }
    };

    const HorizontalMenuItems = [
        { itemKey: 'dashboard', text: 'Dashboard', icon: <IconHome />, url: '/' },
        { 
            itemKey: 'layouts', 
            text: 'Layouts', 
            icon: <IconTemplate />,
            url: '/layouts',
            items: [
                { itemKey: 'about', text: 'About', url: '/about' },
                { itemKey: 'contact', text: 'Contact', url: '/contact' },
                { 
                    itemKey: 'layouts-boxed', 
                    text: 'Boxed Layouts', 
                    url: '/layouts/boxed',
                    items: [
                        { itemKey: 'layouts-boxed-nosidebar', text: 'No Sidebar', url: '/layouts/boxed/nosidebar' },
                        { itemKey: 'layouts-boxed-left-sidebar', text: 'Left Sidebar', url: '/layouts/boxed/left-sidebar' },
                        { itemKey: 'layouts-boxed-right-sidebar', text: 'Right Sidebar', url: '/layouts/boxed/right-sidebar' },
                    ] 
                },
                { 
                    itemKey: 'layouts-full', 
                    text: 'Full Layouts', 
                    url: '/layouts/full',
                    items: [
                        { itemKey: 'layouts-full-nosidebar', text: 'No Sidebar', url: '/layouts/full/nosidebar' },
                        { itemKey: 'layouts-full-left-sidebar', text: 'Left Sidebar', url: '/layouts/full/left-sidebar' },
                        { itemKey: 'layouts-full-right-sidebar', text: 'Right Sidebar', url: '/layouts/full/right-sidebar' },
                    ] 
                },
            ] 
        },
        { itemKey: 'settings', text: 'Settings', icon: <IconSetting />, url: '/settings' },
        { itemKey: 'feedback', text: 'Feedback', icon: <IconStar />, url: '/feedback' },

        ...(!mos_faqs_ajax_obj?.isPro
            ? [
                {
                    itemKey: 'free-vs-pro',
                    text: 'Free vs Pro',
                    icon: <IconMember />,
                    url: '/free-vs-pro'
                }
            ]
            : []
        ),
        // { itemKey: 'free-vs-pro', text: 'Free vs Pro', icon: <IconMember />, url: '/semi/free-vs-pro' },
    ];
    return (
        <LocaleProvider locale={en_US}>
            <div className="mos-faqs-settings-container" style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
                {!mos_faqs_ajax_obj?.isPro &&
                    <Banner 
                        className="mos-faqs-promote-banner"
                        fullMode={false}
                        type="info"
                        description={
                            <>
                                <Text>{__('You\'re currently using the Free plan. ', 'mos-faqs')}</Text>
                                <Text>{__('Some settings and features are only available in ', 'mos-faqs')}</Text>
                                <b><Text link={{ href: 'https://semi.design', target: '_blank' }}>{__('Pro version.', 'mos-faqs')}</Text></b>
                            </>
                        }
                    />
                }                
                <Header
                    style={{backgroundColor:'var(--semi-color-bg-3)'}}
                    className="mos-faqs-header"
                >                    
                    <HorizontalMenuControl
                        items = {HorizontalMenuItems}
                        breakpoint = "960"
                        headerContent = {{
                            logo: <Logo width={36} height={36} />,
                            text: Details?.name,
                        }}
                        footerContent = {(
                            <Space className="header-menu-footer-content" align='center'>  
                                {/* <Badge count={Details?.version} theme='light' countStyle={{padding: 8, height: 'auto'}} />     */}
                                <Button theme='outline' icon={darkmode?<IconSun />:<IconMoon />} aria-label="Mode" onClick={switchingMode} />
                                {/* <a
                                    href="https://wordpress.org/support/plugin/mos-faqs/"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={ __(
                                        'Get support (opens in new tab)',
                                        'mos-faqs'
                                    ) }
                                >
                                    <IconCustomerSupport/>
                                </a>
                                <a
                                    href="https://wordpress.org/support/plugin/mos-faqs/reviews/"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    aria-label={ __(
                                        'Leave a review (opens in new tab)',
                                        'mos-faqs'
                                    ) }
                                >
                                    <IconStar/>
                                </a> */}

                                <Button 
                                    theme='outline' 
                                    icon={<IconCustomerSupport />} 
                                    aria-label={__("Documentation", 'mos-faqs')}
                                    onClick={ () =>
                                        window.open(
                                            'https://wordpress.org/support/plugin/mos-faqs/',
                                            '_blank'
                                        )
                                    }
                                />
                                <Button 
                                    theme='outline' 
                                    icon={<IconStar />} 
                                    aria-label={__("Help Center", 'mos-faqs')} 

                                    onClick={ () =>
                                        window.open(
                                            'https://wordpress.org/support/plugin/mos-faqs/reviews/',
                                            '_blank'
                                        )
                                    }
                                />
                                {/* <Badge count={newsItems.filter(item => !readNewsIds.includes(item.id)).length || 0}>
                                    <Button theme='outline' icon={<IconBellStroked />} onClick={() => handleNewsVisible(true)} aria-label="Screenshot" />
                                </Badge> */}
                            </Space>
                        )}
                    />
                </Header>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/layouts">
                        <Route index element={<Navigate to="boxed/nosidebar" replace />} />
                        <Route path="boxed/nosidebar" element={<BoxedNoSidebar />} />
                        <Route path="boxed/left-sidebar" element={<BoxedLeftSidebar />} />
                        <Route path="boxed/right-sidebar" element={<BoxedRightSidebar />} />
                        <Route path="full/nosidebar" element={<FullWidthNoSidebar />} />
                        <Route path="full/left-sidebar" element={<FullWidthLeftSidebar />} />
                        <Route path="full/right-sidebar" element={<FullWidthRightSidebar />} />
                    </Route>
                    
                    <Route path="/settings" element={<Settings />}>
                        <Route index element={<Navigate to="basic-inputs" replace />} />
                        <Route path="basic-inputs" element={<BasicInputs />} />
                        <Route path="array-inputs" element={<ArrayInputs />} />
                        <Route path="page/page-1" element={<Page />} />
                        <Route path="page/page-2" element={<Page />} />
                        
                        {/* Other menu items */}
                        <Route path="import-export" element={<ImportExport />} />
                        <Route path="more" element={<More />} />
                        {/* <Route path="logs" element={<Logs />} /> */}
                        <Route path="logs" element={<Navigate to="table" replace />} />
                        <Route path="logs/table" element={<LogsTable />} />
                        <Route path="logs/analytics" element={<LogsCharts />} />
                        <Route path="tools" element={<Tools />} />
                    </Route>
                    <Route path="feedback" element={<Feedback />} />
                    <Route path="free-vs-pro" element={<FreeVsPro />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer
                    className="p-[15px] w-full mos-faqs-footer" 
                    style={{borderTop: '1px solid var(--semi-color-border)', backgroundColor:'var(--semi-color-bg-2)'}}
                >
                    <Row type="flex" gutter={24} align="middle" justify="space-between">
                        <Col xs={24} lg={12} className="text-center lg:text-left mb-2 lg:mb-0">
                            <Text>{__(`Copyright © ${year} `, 'mos-faqs')}</Text>
                            <Text link={{ href: Details?.authorURI, target: '_blank' }}>{Details?.author}. </Text>
                            <Text>{__(`All Rights Reserved.`, 'mos-faqs')}</Text>
                            {/* <Space align='center' spacing='medium'>
                                <img src={`${mos_faqs_ajax_obj.image_url}logo.svg`} alt="" width="30" height="30" />
                                <Text>{Details?.name}</Text>
                            </Space> */}
                        </Col>
                        <Col xs={24} lg={12} className="text-center lg:text-right">
                            <Space align='center' spacing='medium'>
                                {mos_faqs_ajax_obj?.isPro === '1'?
                                    <>
                                        <Badge count={__( 'Pro', "mos-faqs" )} theme='light' style={{padding: 8, height: 'auto'}} />
                                        <Badge count={mos_faqs_ajax_obj?.proVersion} theme='light' style={{padding: 8, height: 'auto'}} />
                                    </>
                                    :
                                    <>                                    
                                        <Badge count={__( 'Free', "mos-faqs" )} theme='light' style={{padding: 8, height: 'auto'}} />
                                        <Badge count={Details?.version} theme='light' style={{padding: 8, height: 'auto'}} />
                                    </>
                                }
                                
                            </Space>
                        </Col>
                    </Row>
                </Footer>
                {/* --- What's New SideSheet --- */}
                <SideSheet
                    placement="right"
                    visible={newsVisible}
                    onCancel={() => handleNewsVisible(false)}
                    title={__("What's New?", "mos-faqs")}
                    closeOnEsc={true}
                >
                    {newsItems.length === 0 ? (
                        <p>{__("Loading news...", "mos-faqs")}</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
                                {newsItems
                                    .slice((newsCurrentPage - 1) * itemsPerPage, newsCurrentPage * itemsPerPage)
                                    .map((item) => (
                                    <Card key={item.id} style={{ marginBottom: 12, backgroundColor: !readNewsIds.includes(item.id) ? 'var(--semi-color-primary-light-default)' : '' }} bodyStyle={{ padding: 10 }}>
                                        <Text strong style={{ fontSize: '16px' }}>{!readNewsIds.includes(item.id) ? '• ' : ''}{item.title}</Text>
                                        {item?.tags && item.tags.length > 0 && (
                                            <div className='mt-2'>
                                                <Space>
                                                    {item.tags.map((tag, index) => (
                                                        <Tag key={index} size="small" shape='circle' color='amber'>{tag}</Tag>
                                                    ))}
                                                </Space>
                                            </div>
                                        )}
                                        <div className='mt-2'>
                                            <Paragraph type="secondary">
                                                {truncateText(item.news)}
                                            </Paragraph>
                                            <br />
                                            <Button
                                                type="link"
                                                size="small"

                                                onClick={() => {
                                                    markNewsAsRead(item.id);
                                                    setActiveNews(item);
                                                    setModalVisible(true);
                                                }}
                                            >
                                                {__("Read more", "mos-faqs")}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                            {Math.ceil(newsItems.length / itemsPerPage) > 1 && (
                                <div style={{ borderTop: '1px solid var(--semi-color-border)', flexShrink: 0 }} className='flex justify-between items-center py-4 mt-4'>
                                    <Button
                                        size="small"
                                        onClick={() => setNewsCurrentPage(newsCurrentPage - 1)}
                                        disabled={newsCurrentPage === 1}
                                    >
                                        {__("Previous", "mos-faqs")}
                                    </Button>
                                    <Text>
                                        {__("Page", "mos-faqs")} {newsCurrentPage} {__("of", "mos-faqs")} {Math.ceil(newsItems.length / itemsPerPage)}
                                    </Text>
                                    <Button
                                        size="small"
                                        onClick={() => setNewsCurrentPage(newsCurrentPage + 1)}
                                        disabled={newsCurrentPage === Math.ceil(newsItems.length / itemsPerPage)}
                                    >
                                        {__("Next", "mos-faqs")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </SideSheet>
            </div>
            
            <Modal
                title={activeNews?.title}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                style={{ maxWidth: 700 }}
            >
                <div style={{ maxHeight: 400, overflowY: 'auto' }} className='pb-6'>
                    {activeNews?.tags?.length > 0 && (
                        <Space style={{ marginBottom: 12 }}>
                            {activeNews.tags.map((tag, index) => (
                                <Tag key={index} size="small" shape="circle" color="amber">
                                    {tag}
                                </Tag>
                            ))}
                        </Space>
                    )}

                    <Paragraph>
                        {activeNews?.news}
                    </Paragraph>
                </div>
            </Modal>
        </LocaleProvider>
    );
}
