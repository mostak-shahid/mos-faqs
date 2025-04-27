import React from 'react'
import './Loading.scss'
export default function Loading() {
    return (
        <div className="loading-container">
            <div className="skeleton title"></div>
            <div className="skeleton text"></div>
            <div className="skeleton text"></div>
            <div className="skeleton text" style={{ width: "60%" }}></div>
            <div className="skeleton button"></div>
        </div>
    )
}
