import { __ } from "@wordpress/i18n";
import { useMain } from '../contexts/MainContext';
import withForm from './withForm';

import React, { useEffect, useState } from "react";
import axios from "axios";
// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";

// import DataTable from "datatables.net-react";
// import DT from "datatables.net-bs5";
// DataTable.use(DT);
// import "bootstrap/dist/css/bootstrap.min.css";
// import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";

import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import Responsive from "datatables.net-responsive-bs5";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";

DataTable.use(DT);
DataTable.use(Responsive);

const BasicTable = ({handleChange}) => {
    const {
        settingData,
        settingLoading
    } = useMain();
    const [posts, setPosts] = useState([]);
    const [statusFilter, setStatusFilter] = useState("publish");
    const [bulkAction, setBulkAction] = useState("");
    const [selectedPosts, setSelectedPosts] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const filters = ["publish", "draft", "trash", "pending"];

    useEffect(() => {
        fetchPosts(statusFilter);
    }, [statusFilter]);

    const fetchPosts = async (status) => {
        const res = await axios.get(`/wp-json/wp/v2/posts?per_page=100&status=${status}&_embed`);
        setPosts(res.data);
        setSelectedPosts([]); // reset selection when filter changes
        setSelectAll(false);
    };

    const toggleSelectPost = (id) => {
        setSelectedPosts((prev) =>
        prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
        setSelectedPosts([]);
        setSelectAll(false);
        } else {
        setSelectedPosts(posts.map((p) => p.id));
        setSelectAll(true);
        }
    };

    const changeStatus = async (postId, newStatus) => {
        await axios.post(`/wp-json/wp/v2/posts/${postId}`, { status: newStatus });
        fetchPosts(statusFilter);
    };

    const handleBulkAction = async () => {
        console.log('bulkAction', bulkAction, 'selectedPosts', selectedPosts);
        if (!bulkAction || selectedPosts.length === 0) {
        alert("Please select posts and choose an action.");
        return;
        }

        // for (let postId of selectedPosts) {
        //   await axios.post(`/wp-json/wp/v2/posts/${postId}`, { status: bulkAction });
        // }

        // setSelectedPosts([]);
        // setSelectAll(false);
        // fetchPosts(statusFilter);
    };

    const columns = [
    {
        className: "control",  // 👈 required
        orderable: false,
        data: null,
        defaultContent: "",
    },
    {
        data: null,
        title: `<input type="checkbox" id="select-all" />`,
        orderable: false,
        className: "all",
        render: (data, type, row) =>
            `<input type="checkbox" class="row-checkbox" data-id="${row.id}" ${
            selectedPosts.includes(row.id) ? "checked" : ""
            } />`,
    },
    {
        data: "id",
        title: "ID",
        className: "all"
    },
    {
        data: "author",
        title: "Author",
        className: "min-tablet",
        render: (d, t, row) =>
        row.author
            ? `<img src="${row.author.avatar}" class="rounded-circle me-2" width="24" height="24"/> ${row.author.name}`
            : "—",
    },
    { data: "title", title: "Title", className: "all" },
    {
        data: "categories",
        title: "Category",
        className: "min-desktop",
        render: (d, t, row) => row.categories?.join(", ") || "—",
    },
    {
        data: "tags",
        title: "Tags",
        className: "min-desktop",
        render: (d, t, row) => row.tags?.join(", ") || "—",
    },
    { data: "date", title: "Date", className: "all" },
    {
        data: null,
        title: "Action",
        className: "all",
        render: (d, t, row) => `
        <button class="btn btn-sm btn-success me-1" onclick="window.changeStatus(${row.id}, 'publish')">Publish</button>
        <button class="btn btn-sm btn-warning me-1" onclick="window.changeStatus(${row.id}, 'draft')">Draft</button>
        <button class="btn btn-sm btn-danger" onclick="window.changeStatus(${row.id}, 'trash')">Trash</button>
        `,
    },
    ];


    // Hook checkboxes inside the table
    useEffect(() => {
        const table = document.querySelector("#react-posts-table");
        if (!table) return;

        const handler = (e) => {
        if (e.target.classList.contains("row-checkbox")) {
            const id = parseInt(e.target.getAttribute("data-id"));
            toggleSelectPost(id);
        }
        };

        table.addEventListener("change", handler);
        return () => table.removeEventListener("change", handler);
    }, [posts]);

    useEffect(() => {
        const table = document.querySelector("#react-posts-table");
        if (!table) return;

        // Row checkbox handler
        const rowHandler = (e) => {
            if (e.target.classList.contains("row-checkbox")) {
            const id = parseInt(e.target.getAttribute("data-id"));
            toggleSelectPost(id);
            }
        };

        // Select All handler
        const allHandler = (e) => {
            if (e.target.id === "select-all") {
            toggleSelectAll();
            // sync UI checkboxes
            document.querySelectorAll(".row-checkbox").forEach((cb) => {
                cb.checked = !selectAll;
            });
            }
        };

        table.addEventListener("change", rowHandler);
        table.addEventListener("change", allHandler);

        return () => {
            table.removeEventListener("change", rowHandler);
            table.removeEventListener("change", allHandler);
        };
    }, [posts, selectAll]);


    window.changeStatus = changeStatus;
    return (
        <>
            <div className="setting-unit py-4">
                <div className="mb-3">
                    {filters.map((status) => (
                    <span
                        key={status}
                        href="#"
                        onClick={(e) => {
                        e.preventDefault();
                        setStatusFilter(status);
                        }}
                        className={`me-3 ${statusFilter === status ? "fw-bold text-primary" : ""}`}
                        style={{ cursor: "pointer" }}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    ))}
                </div>

                <div className="mb-3 d-flex">
                    <select
                        className="form-select w-auto me-2"
                        onChange={(e) => setBulkAction(e.target.value)}
                    >
                        <option value="">Bulk Actions</option>
                        {filters.map((s) => (
                            <option
                                key={s}
                                value={s}
                            >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-primary" onClick={handleBulkAction}>
                    Apply
                    </button>
                </div>

                <DataTable
                    id="react-posts-table"
                    data={posts}
                    columns={columns}
                    options={{
                        searching: true,
                        order: [[2, "asc"]],
                        responsive: {
                            details: {
                                type: "column",   // 👈 show arrow in "control" column
                                target: 0         // 👈 column index (0 = our dedicated first col)
                            }
                        },
                        columnDefs: [
                            { className: "control", orderable: false, targets: 0 },
                            { targets: [3, 6], orderable: true },
                            { targets: "_all", orderable: false }
                        ],
                        // responsive: true,   // 👈 enable responsive plugin
                        // dom: "Bfrtip", // ✅ place buttons on top
                    }}
                    className="table table-striped table-bordered"
                />

                {/* 
                <DataTable
                    id="react-posts-table"
                    columns={columns}
                    options={{
                        serverSide: true,
                        processing: true,
                        // responsive: true,   // 👈 enable responsive plugin
                        responsive: {
                            breakpoints: [
                                { name: "bigdesktop", width: Infinity },
                                { name: "meddesktop", width: 1480 },
                                { name: "smalldesktop", width: 1280 },
                                { name: "medium", width: 1188 },
                                { name: "tabletl", width: 1024 },
                                { name: "btwtabllandp", width: 848 },
                                { name: "tabletp", width: 768 },
                                { name: "mobilel", width: 480 },
                                { name: "mobilep", width: 320 }
                            ]
                        },
                        ajax: async (data, callback) => {
                            // same WP REST API logic as before
                        },
                        searching: true,
                        order: [[3, "asc"]],
                        columnDefs: [
                            { targets: [3, 6], orderable: true },
                            { targets: "_all", orderable: false }
                        ],
                        drawCallback: onTableDraw
                    }}
                    className="table table-striped table-bordered nowrap"
                />
                You combine your custom breakpoints with column class names:

                className: "all" → always visible

                className: "none" → hidden, only in details row

                className: "min-tablet" → show at tablet+

                className: "min-desktop" → show at desktop+
                This way you can tune exactly when each column hides, matching your custom widths like 1480px, 1024px, 480px, etc.
                */}
            </div>
        </>
    )
}
export default withForm(BasicTable);