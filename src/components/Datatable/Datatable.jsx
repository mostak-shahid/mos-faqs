import React, { useEffect, useState } from "react";
import axios from "axios";
// import DataTable from "datatables.net-react";
// import DT from "datatables.net-dt";

import DataTable from "datatables.net-react";
import DT from "datatables.net-bs5";
DataTable.use(DT);


import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";


DataTable.use(DT);

const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("publish");
  const [bulkAction, setBulkAction] = useState("");
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
      data: null,
      title: `<input type="checkbox" id="select-all" />`, // must be HTML string
      orderable: false,
      render: (data, type, row) =>
        `<input type="checkbox" class="row-checkbox" data-id="${row.id}" ${
          selectedPosts.includes(row.id) ? "checked" : ""
        } />`
    },
    { data: "id", title: "ID" },
    {
      data: "author",
      title: "Author",
      render: (data, type, row) => {
        const author = row._embedded?.author?.[0];
        return author
          ? `<img src="${author.avatar_urls[24]}" class="rounded-circle me-2" width="24" height="24"/> ${author.name}`
          : "—";
      }
    },
    { data: "title.rendered", title: "Title" },
    {
      data: "categories",
      title: "Category",
      render: (data, type, row) =>
        row._embedded?.["wp:term"]?.[0]?.map((c) => c.name).join(", ") || "—"
    },
    {
      data: "tags",
      title: "Tags",
      render: (data, type, row) =>
        row._embedded?.["wp:term"]?.[1]?.map((t) => t.name).join(", ") || "—"
    },
    { data: "date", title: "Date" },
    {
      data: null,
      title: "Action",
      render: (data, type, row) => `
        <button class="btn btn-sm btn-success me-1" onclick="window.changeStatus(${row.id}, 'publish')">Publish</button>
        <button class="btn btn-sm btn-warning me-1" onclick="window.changeStatus(${row.id}, 'draft')">Draft</button>
        <button class="btn btn-sm btn-danger" onclick="window.changeStatus(${row.id}, 'trash')">Trash</button>
      `
    }
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
    <div>
      <div className="mb-3">
        {["publish", "draft", "trash"].map((status) => (
          <a
            key={status}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setStatusFilter(status);
            }}
            className={`me-3 ${statusFilter === status ? "fw-bold text-primary" : ""}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </div>

      <div className="mb-3 d-flex">
        <select
          className="form-select w-auto me-2"
          onChange={(e) => setBulkAction(e.target.value)}
        >
          <option value="">Bulk Actions</option>
          <option value="publish">Publish</option>
          <option value="draft">Move to Draft</option>
          <option value="trash">Move to Trash</option>
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
          columnDefs: [
            { targets: [2, 3, 5], orderable: true },
            { targets: "_all", orderable: false }
          ]
        }}
        className="table table-striped table-bordered"
      />
    </div>
  );
};


export default PostTable;
