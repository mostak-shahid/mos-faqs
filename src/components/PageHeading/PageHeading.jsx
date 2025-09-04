import React from 'react'
import './PageHeading.scss'
export default function PageHeading({title, subtitle}) {
    return (
        <div className="page-heading-wrap">
            {/* {console.log('component-load:','SectionTitle is rendered')} */}
            {
                title && 
                <h4 className="section-title pl-heading fw-700 text-text" dangerouslySetInnerHTML={{ __html: title }} />
            }
            {
                subtitle && 
                <div className="section-intro pl-body text-text" dangerouslySetInnerHTML={{ __html: subtitle }} />
            }
        </div>
    )
}
