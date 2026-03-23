import React from 'react'
import { __ } from "@wordpress/i18n";
import { Button } from '@douyinfe/semi-ui';
export default function ActionButtons({hasChanges, section, handleReset, handleSubmit}) {

    const onReset = () => {
        handleReset(section);
    };
    return (
        <div className='mt-6'>
            <Button 
                type="primary" 
                theme='solid'
                onClick={handleSubmit}
                disabled={!hasChanges}
            >
                {__('Save Settings', 'mos-faqs')}
            </Button>
            <Button
                type="danger" 
                theme='solid'
                style={{ marginLeft: '12px' }}
                onClick={onReset}
            >
                {__('Reset', 'mos-faqs')}
            </Button>
        </div>
    )
}
