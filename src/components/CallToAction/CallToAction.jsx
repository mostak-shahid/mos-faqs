import React from 'react'
import './CallToAction.scss'
export default function CallToAction({title, content, btnTitle, btnLink='#'}) {
    return (
        <div className="call-to-action-wrapper background-purple-10">
            <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="cta-content text-text">
                    {
                        title &&
                        <div className="heading pl-heading-1 fw-600" dangerouslySetInnerHTML={{ __html: title }}/>
                    }
                    {
                        content &&
                        <div className="intro pl-body fw-400" dangerouslySetInnerHTML={{ __html: content }}/>
                    }
                </div>
                {
                    btnTitle && 
                    <a className="cta-button" href={btnLink}>{btnTitle}</a>
                }
            </div>
        </div>
    )
}
