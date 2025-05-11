import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import noticeClose from '../../assets/images/noticeClose.svg';
import noticeTick from '../../assets/images/noticeTick.svg';
import './Notice.scss';

export default function Notice() {
    const [show, setShows] = useState(true);
    const [additionalClass, setAdditionalClass] = useState('');
    const noticeRef = useRef(null); // Create a reference to the notice div


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setAdditionalClass('fade-out');
    //     }, 3000); 

    //     return () => clearTimeout(timer); // Cleanup timeout on unmount
    // }, []);

    // useEffect(() => {
    //     if (additionalClass === 'fade-out') {
    //         const timer = setTimeout(() => {
    //             if (noticeRef.current) {
    //                 noticeRef.current.style.display = 'none'; // Hide the element safely
    //             }
    //         }, 1000);

    //         return () => clearTimeout(timer); // Cleanup timeout on unmount
    //     }
    // }, [additionalClass]);

    return (
        <>
            {
                show && 
                    <div ref={noticeRef} className={`mos-faqs-notice ${additionalClass}`}>
                        <div className="notice-tick" >
                            <img src={noticeTick} alt="" />
                        </div>
                        <div className="notice-content">
                            {__(
                                'All changes have been applied correctly, ensuring your preferences are now in effect.',
                                "mos-faqs"
                            )}
                        </div>
                        <div className="notice-close" onClick={() => setShows(false)}>
                            <img src={noticeClose} alt="" />
                        </div>
                    </div>
                
            }
        </>
    );
}
