import React from 'react'

export default function Settings() {
    return (
        <div className="mos-faqs-settings">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card rounded-4">                            
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">An item</li>
                                <li className="list-group-item">A second item</li>
                                <li className="list-group-item">A third item</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card rounded-4">
                            <div className="card-header">
                                Featured
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Settings</h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Settings subtitle</h6>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" className="card-link">Card link</a>
                                <a href="#" className="card-link">Another link</a>
                            </div>
                            <div className="card-footer">
                                2 days ago
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
