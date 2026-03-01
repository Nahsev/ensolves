import React, { useEffect, useState } from "react";
import "./NotesPage.css";
function NotesPage() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filter, setFilter] = useState("active");
  const [tagSearch, setTagSearch] = useState("");
  const [tags, setTags] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const link = "https://ensolves.onrender.com/notes";

  useEffect(() => {
    const fetchnotes = async () => {
      try {
        const respons = await fetch(link);
        if (!respons.ok) {
          console.log("error to load the Notes");
        } else {
          const data = await respons.json();
          setData(data);
        }
      } catch (err) {
        console.log(`fail to fetch: ${err}`);
      }
    };

    fetchnotes();
  }, []);

  const handleArchive = async (id) => {
    try {
      const res = await fetch(`${link}/${id}/archive`, {
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
      const res = await fetch(`${link}/${id}/unarchive`, {
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
    const res = await fetch(`${link}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      
      setData((prev) => prev.filter((note) => note.id !== id));
      console.log(`Nota ${id} eliminada correctamente`);
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
      const res = await fetch(link, {
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
    if (!trimmedTag || activeTags.includes(trimmedTag)) return;

    const newActiveTags = [...activeTags, trimmedTag];
    setActiveTags(newActiveTags);

    try {
      
      const res = await fetch(`${link}?tag=${newActiveTags.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } catch (err) {
      console.log("Error filtrando tags:", err);
    }
    setTagSearch(""); 
  };

  const filteredNotes = data.filter((note) => {
  
  if (filter === "active" && note.archived) return false;
  if (filter === "archived" && !note.archived) return false;

  
  if (activeTags.length > 0) {
    if (!note.tags || note.tags.length === 0) return false;

    
    const hasAllTags = activeTags.every((tag) =>
      note.tags.includes(tag)
    );

    if (!hasAllTags) return false;
  }

  return true;
});
  const handleRemoveTag = async (tagToRemove) => {
  const updatedTags = activeTags.filter((tag) => tag !== tagToRemove);
  setActiveTags(updatedTags);

  try {
    if (updatedTags.length === 0) {
      
      const res = await fetch(link);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    } else {
      
      const res = await fetch(`${link}?tag=${updatedTags.join(",")}`);
      if (res.ok) {
        const data = await res.json();
        setData(data);
      }
    }
  } catch (err) {
    console.log("Error actualizando filtros:", err);
  }
};
  return (
    <div>
      <div className="container">
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
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="filters">
        <div>
          <button type="button" onClick={() => setFilter("all")}>
            Mostrar todas
          </button>

          <button type="button" onClick={() => setFilter("active")}>
            Solo activas
          </button>

          <button type="button" onClick={() => setFilter("archived")}>
            Solo archivadas
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
        <div
          className="active-filters-container"
          
        >
          {activeTags.length > 0 && (
            <div className="active-tags">
              <strong>Filtros activos:</strong>
              {activeTags.map((tag, index) => (
                <span key={index} className="active-tag">
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="remove-tag"
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

              {note.tags && note.tags.length > 0 && (
                <div className="tags-container">
                  {note.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="actions">
              <button
                onClick={() =>
                  note.archived
                    ? handleUnArchive(note.id)
                    : handleArchive(note.id)
                }
                className="archive"
              >
                {note.archived ? "Desarchivar" : "Archivar"}
              </button>

              <button onClick={() => handleDelete(note.id)} className="delete">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesPage;
