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

  const toggleSelectPost = (id) => {
    setSelectedPosts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]); // unselect all
    } else {
      setSelectedPosts(posts.map((p) => p.id)); // select all
    }
  };

  useEffect(() => {
    fetchPosts(statusFilter);
  }, [statusFilter]);

  const fetchPosts = async (status) => {
    const res = await axios.get(`/wp-json/wp/v2/posts?per_page=100&status=${status}&_embed`);
    setPosts(res.data);
  };



  const changeStatus = async (postId, newStatus) => {
    await axios.post(`/wp-json/wp/v2/posts/${postId}`, { status: newStatus });
    fetchPosts(statusFilter);
  };

  const columns = [

    {
      data: null,
      title: `<input type="checkbox" id="select-all" />`,
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
          ? `<img src="${author.avatar_urls[24]}" style="border-radius:50%;width:24px;height:24px;margin-right:5px;vertical-align:middle;"/> ${author.name}`
          : "—";
      }
    },
    { data: "title.rendered", title: "Title" },
    {
      data: "categories",
      title: "Category",
      render: (data, type, row) => row._embedded?.["wp:term"]?.[0]?.map(c => c.name).join(", ") || "—"
    },
    {
      data: "tags",
      title: "Tags",
      render: (data, type, row) => row._embedded?.["wp:term"]?.[1]?.map(t => t.name).join(", ") || "—"
    },
    { data: "date", title: "Date" },
    {
      data: null,
      title: "Action",
      render: (data, type, row) => `
        <button onclick="window.changeStatus(${row.id}, 'publish')">Publish</button>
        <button onclick="window.changeStatus(${row.id}, 'draft')">Draft</button>
        <button onclick="window.changeStatus(${row.id}, 'trash')">Trash</button>
      `
    }
  ];

  useEffect(() => {
  const table = document.querySelector("#react-posts-table");
  if (!table) return;

  // Row checkbox click
  table.addEventListener("change", (e) => {
    if (e.target.classList.contains("row-checkbox")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      toggleSelectPost(id);
    }
  });

  // Select All checkbox
  table.addEventListener("change", (e) => {
    if (e.target.id === "select-all") {
      toggleSelectAll();
    }
  });

  return () => {
    table?.removeEventListener("change", () => {});
  };
}, [posts, selectedPosts]);

const handleBulkAction = async () => {
  console.log(bulkAction);
  console.log(selectedPosts);
  if (!bulkAction || selectedPosts.length === 0) {
    alert("Please select posts and choose an action.");
    return;
  }

  // for (let postId of selectedPosts) {
  //   await axios.post(`/wp-json/wp/v2/posts/${postId}`, { status: bulkAction });
  // }

  // setSelectedPosts([]);
  // fetchPosts(statusFilter);
};


  // Expose for inline buttons
  window.changeStatus = changeStatus;

  return (
    <div>
      {console.log(selectedPosts)}
      <div style={{ marginBottom: "10px" }}>

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


        <select onChange={(e) => setBulkAction(e.target.value)}>
          <option value="">Bulk Actions</option>
          <option value="publish">Publish</option>
          <option value="draft">Move to Draft</option>
          <option value="trash">Move to Trash</option>
        </select>
        <button onClick={handleBulkAction}>Apply</button>
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
