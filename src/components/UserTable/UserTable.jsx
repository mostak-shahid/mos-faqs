import { __ } from "@wordpress/i18n";
import axios from "axios";
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
export default function UserTable() {
    const [selectedRows, setSelectedRows] = useState([])
    const [bulkAction, setBulkAction] = useState("-1")
    const [userList,setUserList] = useState([])
    const [records, setRecords] = useState([])
    const [roleList,setRoleList] = useState([])
    const [activeRole, setActiveRole] = useState('')
    const [searchQuery,setSearchQuery] = useState('')
    const columns =  [
        { 
            id: 'username',
            name: 'Username',
            cell: row => (
                <div className="d-flex flex-wrap align-items-center gap-2">
                    <img src={row.data.avatar} alt={row.data.display_name} width="40" height="40" />
                    <span><b>{row.data.user_login}</b></span>
                </div>
            ),
            // selector: row => row.data.user_login,
            // sortable: true,
        },
        {
            id: 'user_registered',
            name: 'Created Date',
            selector: row => row.data.user_registered,
            sortable: true,
        },
        { 
            id: 'mos-faqs-2fa-provider',
            name: '2FA Type',
            selector: row => row.data.user_meta['mos-faqs-2fa-provider']?row.data.user_meta['mos-faqs-2fa-provider']:'N/A',
            sortable: true,
        },
        { 
            id: 'action',
            name: 'Action',
            cell: row => (
                <>
                    <span
                        onClick={() => handleClick2faReset(row.ID)}
                    >
                        {__( "Reset", 'mos-faqs' )}
                    </span>
                    <span
                        onClick={() => handleClick2faDelete(row.ID)}
                    >
                        {__( "Delete", 'mos-faqs' )}
                    </span>
                </>
            ),
            ignoreRowClick: true, // Prevent triggering row click event
            allowoverflow: true, // Ensure it doesn’t interfere with other UI
            button: true, // Ensures proper styling for buttons
            // minWidth: "250px",
            // right: true,
            style: {display: 'flex', justifyContent: 'end', paddingRight: '11px', gap: '8px'}
        }
    ]

    useEffect(() => {
        const baseURL = '/wp-json/mos-faqs/v1';        
        const getRoleData = async () => {
            try {
                const response = await axios.get(`${baseURL}/get-roles`);
                // setSettingData(response.data);
                // Convert the object into an array of objects
                const rolesArray = Object.entries(response.data).map(([key, value]) => ({
                    role: key,
                    ...value
                }));
                // console.log(rolesArray);
                setRoleList(rolesArray)
                
            } catch (error) {
                console.log(error);
            }
        };
        getRoleData();
    },[])
    /*
    useEffect(()=> {
        apiService.getRoleList()
        .then(data=> {
            if(data){
                // Convert the object into an array of objects
                const rolesArray = Object.entries(data).map(([key, value]) => ({
                    role: key,
                    ...value
                }));
                // console.log(rolesArray);
                setRoleList(rolesArray)
            }
        })
        .catch(err=> console.log(err))
    },[])
    useEffect(()=> {
        apiService.getUserList()
        .then(data=> {
            if(data){
                setUserList(data)
                setRecords(data)
            }
        })
        .catch(err=> console.log(err))
    },[])
    */
    useEffect(() => {
        const baseURL = '/wp-json/mos-faqs/v1';        
        const getUserData = async () => {
            try {
                const response = await axios.get(`${baseURL}/get-users`);
                setUserList(response.data)
                setRecords(response.data)                
            } catch (error) {
                console.log(error);
            }
        };
        getUserData();
    },[])

    const handleSelectedRowsChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
        // console.log(selectedRows)
    };
    const handleUserSearch = (e) => {
        setSearchQuery(e.target.value)
        setActiveRole('') // Reset the active role
        const newData = userList.filter(row => {
            return row.data.user_login.toLowerCase().includes(e.target.value.toLowerCase())
        })
        setRecords(newData)
    }
    const handleUserFilter = (role) => {
        setSearchQuery('')
        if (role == 'All') {
            setRecords(userList)        
            setActiveRole(''); // Set the active role
        } else {
            const newData = userList.filter(row => {
                return row.data.role.toLowerCase().includes(role.toLowerCase())
            })
            setRecords(newData)        
            setActiveRole(role); // Set the active role
        }
    }
    const handleClick2faReset = (user_id) => {
        // console.log("Reset 2fa for: ", user_id)
        const confirmed = window.confirm(__('Are you sure you want to proceed?', 'mos-faqs'));
        if (confirmed) {
            apiService.formDataPost('mos-faqs_user_2fa_reset',{"user_id": user_id})
            .then(data=> {
                // setForceLogoutLoading(false)            
                if(data.success){
                    apiService.getUserList()
                    .then(data=> {
                        if(data){
                            setUserList(data)
                            setRecords(data)
                            setActiveRole('') // Reset the active role
                        }
                    })
                    .catch(err=> console.log(err))
                    console.log(data.data)
                    alert(data.data.success_message)
                } else {
                    console.log(data.data.error_message)
                }
            })
            .catch(err=> {
                // setForceLogoutLoading(false)             
                alert(data.data.error_message)
            })
        }
        
    }
    const handleClick2faDelete = (user_id) => {
        const confirmed = window.confirm(__('Are you sure you want to proceed?', 'mos-faqs'));
        if (confirmed) {
            console.log("Delete 2fa for: ", user_id)
        }
    }
    const handleClick2faResetAll = () => {
        const confirmed = window.confirm(__('Are you sure you want to proceed?', 'mos-faqs'));
        if (confirmed) {
            apiService.formDataPost('mos-faqs_user_2fa_reset_all', {})
            .then(data=> {
                console.log(data)
                // setForceLogoutLoading(false)            
                if(data.success){
                    setBulkAction("-1")
                    setSelectedRows([])

                    apiService.getUserList()
                    .then(data=> {
                        if(data){
                            setUserList(data)
                            setRecords(data)
                            setActiveRole('') // Reset the active role
                        }
                    })
                    .catch(err=> console.log(err))

                    console.log(data.data)
                    alert(data.data.success_message)
                } else {
                    console.log(data.data.error_message)
                }
            })
            .catch(err=> {
                // setForceLogoutLoading(false)             
                alert(data.data.error_message)
            })
        }
    }
    const handleClick2faDeleteAll = () => {
        const confirmed = window.confirm(__('Are you sure you want to proceed?', 'mos-faqs'));
        if (confirmed) {
            console.log("Delete all 2fa")
        }
    }
    const handleBulkActionChange = (e) => {
        setBulkAction(e.target.value);
    };    
    const handleBulkActionSubmit = () => {
        if (selectedRows.length) {
            const ids = selectedRows.map(item => item.ID);           

            if (bulkAction === "reset") {
                console.log("Reset these ids", ids)
                apiService.formDataPost('mos-faqs_user_2fa_reset_users',{"user_ids": ids})
                .then(data=> {
                    console.log(data)
                    // setForceLogoutLoading(false)            
                    if(data.success){
                        setBulkAction("-1")
                        setSelectedRows([])

                        apiService.getUserList()
                        .then(data=> {
                            if(data){
                                setUserList(data)
                                setRecords(data)
                                setActiveRole('') // Reset the active role
                            }
                        })
                        .catch(err=> console.log(err))

                        console.log(data.data)
                        alert(data.data.success_message)
                    } else {
                        console.log(data.data.error_message)
                    }
                })
                .catch(err=> {
                    // setForceLogoutLoading(false)             
                    alert(data.data.error_message)
                })

            } else if (bulkAction === "delete") {
                console.log("Delete these ids", ids)
                // apiService.formDataPost('mos-faqs_send_password_reset_emails',{"user_ids": ids})
                // .then(data=> {
                //     // setForceLogoutLoading(false)            
                //     if(data.success){
                //         setBulkAction("-1")
                //         // setSelectedRows([])
                //         setClearRowsToggle(false)
                //         console.log(data.data)
                //         alert(data.data.success_message)
                //     } else {
                //         console.log(data.data.error_message)
                //     }
                // })
                // .catch(err=> {
                //     setForceLogoutLoading(false)             
                //     alert(data.data.error_message)
                // })
                // alert("Password reset emails sent to selected users.");
            } else {
                alert("Please select a valid action.");
            }
        } else {
            alert("Please select users.");
        }
    };
    return (        
        <div className="user-datatable datatable-unit">
            <div className="row justify-content-between mb-30">
                <div className="col-8 filters">
                    <div className="d-flex flex-wrap wp-roles">
                        <span
                            onClick={() => handleUserFilter('All')}
                            className={activeRole === '' ? 'active' : ''} // Apply active class conditionally
                            >All</span>
                        {
                            roleList && roleList.map(item=> (                                        
                                item?.count ? 
                                <span 
                                    key={item.role} 
                                    value={item.role} 
                                    onClick={() => handleUserFilter(item.name)}
                                    className={activeRole === item.name ? 'active' : ''} // Apply active class conditionally
                                >
                                {item.name} ({item.count})
                                </span> 
                                : ''                                        
                            ))      
                        }
                    </div>
                    <div className="bulk-action-wrapper">
                        <select value={bulkAction} name="action"  onChange={handleBulkActionChange}>
                            <option value="-1">{__( 'Bulk actions', 'mos-faqs' )}</option>
                            <option value="reset">{__( 'Reset', 'mos-faqs' )}</option>
                            <option value="delete">{__( 'Delete', 'mos-faqs' )}</option>
                        </select>
                        <button className="button button-secondary" onClick={handleBulkActionSubmit}>Apply</button>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="search-unit d-flex gap-2 align-items-center">
                        <input placeholder="Search Users" type="search" onChange={handleUserSearch} value={searchQuery} />
                        <button className="button button-secondary" type="button">{__( 'Search', 'mos-faqs' )}</button>
                    </div>
                    <div className="action-buttons d-flex align-items-center">
                        <span onClick={handleClick2faResetAll}>{__( 'Reset All 2FA', 'mos-faqs' )}</span>
                        <span onClick={handleClick2faDeleteAll}>{__( 'Delete All 2FA', 'mos-faqs' )}</span>
                    </div>
                </div>
            </div>            
            <div className="table-wrapper">
                <DataTable
                    columns={columns}
                    // data={data}
                    data={records}
                    selectableRows // for making row selectable
                    onSelectedRowsChange={handleSelectedRowsChange} // Handle row selection changes  
                    // clearSelectedRows={clearRowsToggle}              
                    // expandableRows
                    // expandableRowsComponent={ExpandedComponent}
                    pagination
                    dense
                    responsive
                    // persistTableHead
                />
            </div> 
        </div>          
    )
}
