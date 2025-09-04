import { __ } from "@wordpress/i18n";
import { useMain } from '../contexts/MainContext';
import withForm from './withForm';
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
import Responsive from "datatables.net-responsive-bs5";

import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";

DataTable.use(DT);
DataTable.use(Responsive);

// ✅ Set nonce header globally for all axios calls
axios.defaults.headers.common["X-WP-Nonce"] = mos_faqs_ajax_obj.api_nonce;

const AjaxTable = () => {
    const [reloadTable, setReloadTable] = useState(0);
    const [statusFilter, setStatusFilter] = useState("publish");
    const [bulkAction, setBulkAction] = useState("");
    const [selectedPosts, setSelectedPosts] = useState([]);
    const statusRef = useRef(statusFilter);
    const tableRef = useRef(null); // store DataTable API instance here
    const filters = ["publish", "draft", "trash", "pending"];

    // keep ref in sync
    useEffect(() => {
        statusRef.current = statusFilter;
        if (tableRef.current) {
            tableRef.current.ajax.reload();
        }
    }, [statusFilter, reloadTable]);

    // ✅ Single post status change
    window.changeStatus = async (postId, newStatus) => {
        await axios.post(`/wp-json/mos-faqs/v1/post/${postId}/status`, {
            status: newStatus,
        });
        // const api = window.$?.fn?.dataTable?.tables({ api: true });
        // api?.ajax?.reload();
        setReloadTable(Math.random);
    };

    // ✅ Bulk action
    const handleBulkAction = async () => {
        if (!bulkAction || selectedPosts.length === 0) {
            alert("Please select posts and choose an action.");
            return;
        }
        await axios.post("/wp-json/mos-faqs/v1/posts/status", {
            ids: selectedPosts,
            status: bulkAction,
        });
        setSelectedPosts([]);
        // const api = window.$?.fn?.dataTable?.tables({ api: true });
        // api?.ajax?.reload();
        setReloadTable(Math.random);
    };

    // ✅ Columns
    const columns = [
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
        { data: "id", title: "ID", className: "all" },
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
        { data: "status", title: "Status", className: "all" },
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

    // ✅ Handle checkbox events on each draw
    const onTableDraw = () => {
        // Row checkboxes
        document.querySelectorAll(".row-checkbox").forEach((cb) => {
        cb.onchange = (e) => {
            const id = parseInt(e.target.getAttribute("data-id"), 10);
            setSelectedPosts((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
            );
        };
        });

        // Select All
        const selectAll = document.getElementById("select-all");
        if (selectAll) {
        selectAll.onchange = (e) => {
            if (e.target.checked) {
            const allIds = Array.from(document.querySelectorAll(".row-checkbox")).map(
                (cb) => parseInt(cb.getAttribute("data-id"), 10)
            );
            setSelectedPosts(allIds);
            document.querySelectorAll(".row-checkbox").forEach((cb) => (cb.checked = true));
            } else {
            setSelectedPosts([]);
            document.querySelectorAll(".row-checkbox").forEach((cb) => (cb.checked = false));
            }
        };
        }
    };

    return (
        <div>
        {/* Filters */}
        <div className="mb-3">
            {filters.map((s) => (
            <span
                key={s}
                onClick={(e) => {
                e.preventDefault();
                setStatusFilter(s);
                }}
                className={`me-3 ${statusFilter === s ? "fw-bold text-primary" : ""}`}
                style={{ cursor: "pointer" }}
            >
                {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
            ))}
        </div>

        {/* Bulk Actions */}
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

        {/* DataTable */}
            <DataTable
        id="react-posts-table"
        columns={columns}
        options={{
            serverSide: true,
            processing: true,
            responsive: true,
            ajax: async (data, callback) => {
            const page = data.start / data.length + 1;
            const perPage = data.length;

            let url = `/wp-json/mos-faqs/v1/posts?page=${page}&per_page=${perPage}&status=${encodeURIComponent(statusRef.current)}`;

            if (data.search?.value) {
                url += `&search=${encodeURIComponent(data.search.value)}`;
            }

            if (data.order?.length) {
                const order = data.order[0];
                const col = columns[order.column]?.data;
                if (col === "title" || col === "date" || col === "id") {
                url += `&orderby=${col}&order=${order.dir}`;
                }
            }

            const res = await axios.get(url, {
                headers: { "X-WP-Nonce": mos_faqs_ajax_obj.api_nonce },
            });

            callback({
                draw: data.draw,
                recordsTotal: res.data.total,
                recordsFiltered: res.data.total,
                data: res.data.data,
            });
            },
            initComplete: function () {
            // store API instance for later use
            tableRef.current = this.api();
            },
        }}
        className="table table-striped table-bordered"
        />
        </div>
    );
};
export default withForm(AjaxTable);