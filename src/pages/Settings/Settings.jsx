import React from 'react'

export default function Settings() {
    return (
        <div className="mos-faqs-settings">
            <div className="container">
                <div className="row g-0">
                    <div className="col-lg-3 d-none d-lg-block">
                        <div className="card mt-0 rounded-0" style={{marginRight:'-1px', height: "100%"}}>                            
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">An item</li>
                                <li className="list-group-item">A second item</li>
                                <li className="list-group-item">A third item</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <div className="card mt-0 rounded-0">
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
                            <div className="card-footer d-flex gap-2">
                                <button type="button" class="btn btn-primary btn-sm">Save</button>
                                <button type="button" class="btn btn-outline-primary btn-sm">Reset</button>
                                <button type="button" class="btn btn-outline-primary btn-sm">Reset All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
