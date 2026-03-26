import { __ } from "@wordpress/i18n";
import { useCallback, useEffect, useState } from 'react';
import { formDataPost } from "../../lib/Helpers"; // Import utility function
import './PluginCard.css';
import { Space, Tag, Typography } from '@douyinfe/semi-ui';
import {IconHistogram} from '@douyinfe/semi-icons';
import { Rating } from '@douyinfe/semi-ui';
import {WordPress} from '../../lib/Illustrations';
export default function PluginCard(plugin) {
    const {image, name, intro, author, plugin_source='internal', plugin_slug='', plugin_file='', download_url='', version='1.0.0', rating='0', num_ratings='0', active_installs='0', tested} = plugin;
    const { Text, Paragraph, Title } = Typography;
    return (
        <div className="mos-faqs-plugin-card p-4">
            <Space align='center'>
                <img
                    alt={name}
                    src={image}
                    style={{flex: '0 0 80px', maxWidth: '80px'}} 
                />
                <div>
                    <a href={`https://wordpress.org/plugins/${plugin_slug}/`} target="_blank"><Title heading={6} style={{fontSize: 18, marginBottom: 0}} >{name}</Title></a>
                    <Space align='center'>
                        <Rating allowHalf defaultValue={(rating/20).toFixed(2)} disabled/>   
                        <Text type="quaternary">({num_ratings})</Text>
                    </Space> 
                </div>
            </Space>
            {/* <Paragraph ellipsis={{ showTooltip: true }} style={{ maxWidth: 250 }}>{intro}</Paragraph> */}
            <div className="mt-3">
                <Paragraph>{intro}</Paragraph>
            </div>
            <div className="flex justify-between mt-2">
                <span dangerouslySetInnerHTML={{__html: author}}/>
                <Tag color='green' size='large'>{version}</Tag>
            </div>
            <div className="flex justify-between mt-1">
                <Space align='center'><IconHistogram style={{fontSize: 24}} /><span>{__(`${active_installs} ${active_installs>0?"+":""} active installations`, "mos-faqs")}</span></Space>
                <Space align='center'><WordPress width='24' height='24'/> {__(`Tested with ${tested}`, "mos-faqs")}</Space>
            </div>            
        </div>
    )
}
