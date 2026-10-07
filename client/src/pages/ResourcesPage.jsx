import { useEffect, useState } from 'react';
import api from '../api/client';

function ResourcesPage() {
  const [resources, setResources] = useState([]);

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [type, setType] = useState('docs');

  // Edit state
  const [editingResource, setEditingResource] = useState(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // Get all resources when the page loads
  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setError('');

      const response = await api.get('/resources');

      setResources(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to load resources.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Put a resource into edit mode
  const handleEdit = (resource) => {
    setEditingResource(resource);

    setTitle(resource.title);
    setUrl(resource.url);
    setNotes(resource.notes);
    setType(resource.type);
  };

  // Create or update a resource
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setCreating(true);

      if (editingResource) {
        // UPDATE
        const response = await api.put(
          `/resources/${editingResource.id}`,
          {
            title,
            url,
            notes,
            type,
          }
        );

        setResources((currentResources) =>
          currentResources.map((resource) =>
            resource.id === editingResource.id
              ? response.data
              : resource
          )
        );

        setEditingResource(null);
      } else {
        // CREATE
        const response = await api.post('/resources', {
          title,
          url,
          notes,
          type,
        });

        setResources((currentResources) => [
          ...currentResources,
          response.data,
        ]);
      }

      // Clear form
      setTitle('');
      setUrl('');
      setNotes('');
      setType('docs');

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to save resource.'
      );
    } finally {
      setCreating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingResource(null);

    setTitle('');
    setUrl('');
    setNotes('');
    setType('docs');

    setError('');
  };

  // Delete a resource
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this resource?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingId(id);

      await api.delete(`/resources/${id}`);

      setResources((currentResources) =>
        currentResources.filter(
          (resource) => resource.id !== id
        )
      );

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to delete resource.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1>Resources</h1>

      {error && <p>{error}</p>}

      {/* Resource form */}
      <section>
        <h2>
          {editingResource
            ? 'Edit Resource'
            : 'Add Resource'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">
              Title
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="url">
              URL
            </label>

            <input
              id="url"
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              required
            />
          </div>

          <div>
            <label htmlFor="type">
              Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
            >
              <option value="docs">
                Documentation
              </option>

              <option value="tutorial">
                Tutorial
              </option>

              <option value="article">
                Article
              </option>

              <option value="video">
                Video
              </option>

              <option value="tool">
                Tool
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows="4"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
          >
            {creating
              ? 'Saving...'
              : editingResource
                ? 'Save Changes'
                : 'Add Resource'}
          </button>

          {editingResource && (
            <button
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      {/* Resource list */}
      <section>
        <h2>Your Resources</h2>

        {loading ? (
          <p>Loading resources...</p>
        ) : resources.length === 0 ? (
          <p>No resources found.</p>
        ) : (
          <div>
            {resources.map((resource) => (
              <article key={resource.id}>
                <h3>{resource.title}</h3>

                <p>{resource.notes}</p>

                <p>
                  Type: {resource.type}
                </p>

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit resource
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(resource)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(resource.id)
                  }
                  disabled={
                    deletingId === resource.id
                  }
                >
                  {deletingId === resource.id
                    ? 'Deleting...'
                    : 'Delete'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ResourcesPage;