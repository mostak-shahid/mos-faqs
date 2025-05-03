import React from 'react'
import './InfoBox.scss'
export default function InfoBox({title, content, className}) {
    return (
        <div className="infobox-wrapper">
            <div className={`infobox ${className}`}>
                { 
                    title ? 
                    <strong>{title}:</strong> : ''
                }
                {" "}
                {
                    content ? 
                    <span>{content}</span> : ''
                }
            </div>
        </div>
    )
}
