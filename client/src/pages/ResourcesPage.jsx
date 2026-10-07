import { useEffect, useState } from 'react';
import api from '../api/client';

import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Card from '../components/Card';
import Badge from '../components/Badge';

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

  const handleEdit = (resource) => {
    setEditingResource(resource);

    setTitle(resource.title);
    setUrl(resource.url);
    setNotes(resource.notes);
    setType(resource.type);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setCreating(true);

      if (editingResource) {
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

  const handleCancelEdit = () => {
    setEditingResource(null);

    setTitle('');
    setUrl('');
    setNotes('');
    setType('docs');

    setError('');
  };

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

  const typeOptions = [
    {
      value: 'docs',
      label: 'Documentation',
    },
    {
      value: 'tutorial',
      label: 'Tutorial',
    },
    {
      value: 'article',
      label: 'Article',
    },
    {
      value: 'video',
      label: 'Video',
    },
    {
      value: 'tool',
      label: 'Tool',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];

  const getTypeLabel = (resourceType) => {
    const option = typeOptions.find(
      (item) => item.value === resourceType
    );

    return option
      ? option.label
      : resourceType;
  };

  return (
    <div className="page">

      {/* Page Header */}
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Developer Workspace
          </p>

          <h1 className="page-title">
            Resources
          </h1>

          <p className="page-description">
            Save documentation, tutorials, articles,
            tools and other useful developer resources
            you want to return to later.
          </p>
        </div>

        <div className="page-header-stat">
          <span>{resources.length}</span>
          <small>
            {resources.length === 1
              ? 'Resource'
              : 'Resources'}
          </small>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Add/Edit Resource */}
      <Card className="form-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingResource
                ? 'Edit Resource'
                : 'Add a Resource'}
            </h2>

            <p>
              {editingResource
                ? 'Update the information for this resource.'
                : 'Keep useful developer resources organized in one place.'}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="resource-form"
        >
          <div className="form-grid">
            <Input
              label="Title"
              id="title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="React documentation"
              required
            />

            <Input
              label="URL"
              id="url"
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://example.com"
              required
            />

            <Select
              label="Type"
              id="type"
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              options={typeOptions}
            />
          </div>

          <Textarea
            label="Notes"
            id="notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Add a short note about why this resource is useful..."
            rows={4}
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={creating}
            >
              {creating
                ? 'Saving...'
                : editingResource
                  ? 'Save Changes'
                  : 'Add Resource'}
            </Button>

            {editingResource && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Resources */}
      <section className="resources-section">

        <div className="section-heading">
          <div>
            <h2>Your Resources</h2>

            <p>
              Everything you've saved for your
              development workflow.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              +
            </div>

            <h3>
              No resources yet
            </h3>

            <p>
              Add your first documentation page,
              tutorial, article or developer tool.
            </p>
          </div>
        ) : (
          <div className="resource-grid">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className="resource-card"
              >
                <div className="resource-card-top">

                  <Badge>
                    {getTypeLabel(resource.type)}
                  </Badge>

                  <span className="resource-actions">
                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        handleEdit(resource)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-button text-button-danger"
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
                  </span>

                </div>

                <h3 className="resource-title">
                  {resource.title}
                </h3>

                {resource.notes && (
                  <p className="resource-notes">
                    {resource.notes}
                  </p>
                )}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-url"
                >
                  <span>
                    Visit resource
                  </span>

                  <span>
                    ↗
                  </span>
                </a>
              </Card>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default ResourcesPage;