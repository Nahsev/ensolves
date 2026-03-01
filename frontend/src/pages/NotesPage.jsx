import React, { useEffect, useState, useRef } from "react";

import "./NotesPage.css";

function NotesPage() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("active");
  const [tagSearch, setTagSearch] = useState("");
  const [tags, setTags] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [noteTagInputs, setNoteTagInputs] = useState({});
  const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "").replace(/\/+notes\/*$/, "");
  const link = API_BASE_URL + "/notes";

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = { ...options.headers };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  };

  const formRef = useRef(null);

  useEffect(() => {
    const fetchnotes = async () => {
      try {
        const username = localStorage.getItem("username");
        const res = await fetchWithAuth(`${link}?username=${username}`);
        if (!res.ok) {
          console.log("Error loading notes");
        } else {
          const notes = await res.json();
          setData(notes);
        }
      } catch (err) {
        console.log(`Fail to fetch: ${err}`);
      }
    };

    fetchnotes();
  }, []);

  const handleArchive = async (id) => {
    try {
      const res = await fetchWithAuth(`${link}/${id}/archive`, {
        method: "PATCH",
      });

      if (res.ok) {
        const updatedNote = await res.json();

        setData((prev) =>
          prev.map((note) => (note.id === id ? updatedNote : note)),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnArchive = async (id) => {
    try {
      const res = await fetchWithAuth(`${link}/${id}/unarchive`, {
        method: "PATCH",
      });

      if (res.ok) {
        const updatedNote = await res.json();

        setData((prev) =>
          prev.map((note) => (note.id === id ? updatedNote : note)),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetchWithAuth(`${link}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setData((prev) => prev.filter((note) => note.id !== id));
      } else {
        const errorData = await res.json();
        console.log("Error deleting note:", errorData.message);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth(link, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags: tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== ""),
        }),
      });

      if (res.ok) {
        const newNote = await res.json();
        setData((prev) => [...prev, newNote]);
        setTitle("");
        setContent("");
        setTags("");
      } else {
        console.log("Error creating note");
      }
    } catch (err) {
      console.log(`fail to create note: ${err}`);
    }
  };
  const handleTagSearch = async (tag) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag || activeTags.includes(trimmedTag)) {
      setTagSearch("");
      return;
    }

    const newActiveTags = [...activeTags, trimmedTag];
    setActiveTags(newActiveTags);

    try {
      const params = new URLSearchParams();
      params.append("tag", newActiveTags.join(","));

      if (filter !== "all") {
        params.append("archived", filter === "archived");
      }

      const res = await fetchWithAuth(`${link}?${params.toString()}`);

      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error("Error filtrando tags:", err);
    } finally {
      setTagSearch("");
    }
  };

  const filteredNotes = data.filter((note) => {
    if (filter === "active" && note.archived) return false;
    if (filter === "archived" && !note.archived) return false;

    if (activeTags.length > 0) {
      if (!note.tags || note.tags.length === 0) return false;

      const hasMatch = activeTags.some((tag) => note.tags.includes(tag));
      if (!hasMatch) return false;
    }

    return true;
  });

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = activeTags.filter((tag) => tag !== tagToRemove);
    setActiveTags(updatedTags);

    try {
      if (updatedTags.length === 0) {
        const res = await fetchWithAuth(link);
        if (res.ok) {
          const data = await res.json();
          setData(data);
        }
      } else {
        const res = await fetchWithAuth(`${link}?tag=${updatedTags.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          setData(data);
        }
      }
    } catch (err) {
      console.log("Error actualizando filtros:", err);
    }
  };
  const handleEdit = (id) => {
    const noteToEdit = data.find((note) => note.id === id);
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setTags(noteToEdit.tags ? noteToEdit.tags.join(", ") : "");
      setEditingId(id);

      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const removeTagFromNote = async (noteId, tagToRemove) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove the tag "${tagToRemove}" from this note?`,
    );
    if (!confirmDelete) return;

    const note = data.find((n) => n.id === noteId);
    if (!note) return;

    const updatedTags = note.tags.filter((t) => t !== tagToRemove);

    try {
      const res = await fetchWithAuth(`${link}/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          tags: updatedTags,
        }),
      });

      if (res.ok) {
        const updatedNote = await res.json();
        setData((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)));
      } else {
        console.error("Failed to remove tag from note");
      }
    } catch (err) {
      console.error("Error removing tag from note:", err);
    }
  };
  const handleAddTag = async (noteId) => {
    const note = data.find((n) => n.id === noteId);
    if (!note) return;

    const newTag = noteTagInputs[noteId]?.trim();
    if (!newTag || note.tags.includes(newTag)) return; // evitar vacíos o duplicados

    const updatedTags = [...note.tags, newTag];

    try {
      const res = await fetchWithAuth(`${link}/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          tags: updatedTags,
        }),
      });

      if (res.ok) {
        const updatedNote = await res.json();
        setData((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)));
        setNoteTagInputs((prev) => ({ ...prev, [noteId]: "" })); // limpiar input
      } else {
        console.error("Failed to add tag");
      }
    } catch (err) {
      console.error("Error adding tag:", err);
    }
  };

  return (
    <div>
      <div ref={formRef} className="container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tags (separated by ,)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button type="submit">{editingId ? "Update" : "Create Note"}</button>
        </form>
      </div>

      <div className="filters">
        <div>
          <button type="button" onClick={() => setFilter("all")}>
            Show all
          </button>

          <button type="button" onClick={() => setFilter("active")}>
            Only active
          </button>

          <button type="button" onClick={() => setFilter("archived")}>
            Only archived
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Filter by tag"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
          />
          <button onClick={() => handleTagSearch(tagSearch)}>Search</button>
        </div>
      </div>
      <div>
        <div className="active-filters-container">
          {activeTags.length > 0 && (
            <div className="active-tags">
              <strong>Active filters:</strong>
              {activeTags.map((tag, index) => (
                <span key={index} className="active-tag">
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTag(tag);
                    }}
                    className="remove-tag-button"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="container">
        {filteredNotes.map((note) => (
          <div className="notes container" key={note.id}>
            <div className="text">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <p>{note.archived ? "Archived" : "Active"}</p>
              <div className="prub">
                {note.tags &&
                  note.tags.map((tag, index) => (
                    <div className="tag-container" key={index}>
                      <div
                        key={index}
                        className="tag"
                        onClick={() => handleTagSearch(tag)}
                        style={{ cursor: "pointer" }}
                      >
                        #{tag}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromNote(note.id, tag);
                        }}
                        className="remove-tag-button"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                <div className="add-tag-container">
                  <input
                    type="text"
                    placeholder="Add tag"
                    value={noteTagInputs[note.id] || ""}
                    onChange={(e) =>
                      setNoteTagInputs((prev) => ({
                        ...prev,
                        [note.id]: e.target.value,
                      }))
                    }
                  />
                  <button type="button" onClick={() => handleAddTag(note.id)}>
                    Add Tag
                  </button>
                </div>
              </div>
            </div>
            <div className="actions">
              <button onClick={() => handleEdit(note.id)}>Edit</button>
              <button
                onClick={() =>
                  note.archived
                    ? handleUnArchive(note.id)
                    : handleArchive(note.id)
                }
                className="archive"
              >
                {note.archived ? "Unarchive" : "Archive"}
              </button>

              <button onClick={() => handleDelete(note.id)} className="delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesPage;
