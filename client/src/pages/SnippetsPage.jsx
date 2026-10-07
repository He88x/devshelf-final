import { useEffect, useState } from 'react';
import api from '../api/client';

import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Card from '../components/Card';
import Badge from '../components/Badge';

function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const [editingSnippet, setEditingSnippet] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setError('');

      const response = await api.get('/snippets');

      setSnippets(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to load snippets.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (snippet) => {
    setEditingSnippet(snippet);

    setTitle(snippet.title);
    setDescription(snippet.description);
    setCode(snippet.code);
    setLanguage(snippet.language);
    setTags(snippet.tags);

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

      if (editingSnippet) {
        const response = await api.put(
          `/snippets/${editingSnippet.id}`,
          {
            title,
            description,
            code,
            language,
            tags,
          }
        );

        setSnippets((currentSnippets) =>
          currentSnippets.map((snippet) =>
            snippet.id === editingSnippet.id
              ? response.data
              : snippet
          )
        );

        setEditingSnippet(null);
      } else {
        const response = await api.post('/snippets', {
          title,
          description,
          code,
          language,
          tags,
        });

        setSnippets((currentSnippets) => [
          ...currentSnippets,
          response.data,
        ]);
      }

      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('javascript');
      setTags('');

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to save snippet.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSnippet(null);

    setTitle('');
    setDescription('');
    setCode('');
    setLanguage('javascript');
    setTags('');

    setError('');
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this snippet?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingId(id);

      await api.delete(`/snippets/${id}`);

      setSnippets((currentSnippets) =>
        currentSnippets.filter(
          (snippet) => snippet.id !== id
        )
      );

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to delete snippet.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const languageOptions = [
    {
      value: 'javascript',
      label: 'JavaScript',
    },
    {
      value: 'typescript',
      label: 'TypeScript',
    },
    {
      value: 'jsx',
      label: 'JSX',
    },
    {
      value: 'python',
      label: 'Python',
    },
    {
      value: 'csharp',
      label: 'C#',
    },
    {
      value: 'java',
      label: 'Java',
    },
    {
      value: 'html',
      label: 'HTML',
    },
    {
      value: 'css',
      label: 'CSS',
    },
    {
      value: 'sql',
      label: 'SQL',
    },
    {
      value: 'other',
      label: 'Other',
    },
  ];

  const getLanguageLabel = (snippetLanguage) => {
    const option = languageOptions.find(
      (item) => item.value === snippetLanguage
    );

    return option
      ? option.label
      : snippetLanguage;
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
            Snippets
          </h1>

          <p className="page-description">
            Store reusable pieces of code so you can
            quickly find and use them across your
            development projects.
          </p>
        </div>

        <div className="page-header-stat">
          <span>{snippets.length}</span>

          <small>
            {snippets.length === 1
              ? 'Snippet'
              : 'Snippets'}
          </small>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Add/Edit Snippet */}
      <Card className="form-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingSnippet
                ? 'Edit Snippet'
                : 'Add a Snippet'}
            </h2>

            <p>
              {editingSnippet
                ? 'Update your reusable code snippet.'
                : 'Save useful code that you may need again.'}
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
              id="snippet-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="React useEffect example"
              required
            />

            <Select
              label="Language"
              id="snippet-language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
              options={languageOptions}
            />

            <Input
              label="Tags"
              id="snippet-tags"
              value={tags}
              onChange={(event) =>
                setTags(event.target.value)
              }
              placeholder="react, hooks, frontend"
            />
          </div>

          <Textarea
            label="Description"
            id="snippet-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="What does this snippet do?"
            rows={3}
          />

          <Textarea
            label="Code"
            id="snippet-code"
            value={code}
            onChange={(event) =>
              setCode(event.target.value)
            }
            placeholder="Paste your code here..."
            rows={10}
            required
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={creating}
            >
              {creating
                ? 'Saving...'
                : editingSnippet
                  ? 'Save Changes'
                  : 'Add Snippet'}
            </Button>

            {editingSnippet && (
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

      {/* Snippet List */}
      <section className="resources-section">

        <div className="section-heading">
          <div>
            <h2>Your Snippets</h2>

            <p>
              Your reusable code library.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading snippets...</p>
          </div>
        ) : snippets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              {'</>'}
            </div>

            <h3>
              No snippets yet
            </h3>

            <p>
              Save your first reusable piece of code.
            </p>
          </div>
        ) : (
          <div className="snippet-grid">
            {snippets.map((snippet) => (
              <Card
                key={snippet.id}
                className="snippet-card"
              >
                <div className="snippet-card-top">

                  <Badge>
                    {getLanguageLabel(
                      snippet.language
                    )}
                  </Badge>

                  <span className="resource-actions">
                    <button
                      type="button"
                      className="text-button"
                      onClick={() =>
                        handleEdit(snippet)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="text-button text-button-danger"
                      onClick={() =>
                        handleDelete(snippet.id)
                      }
                      disabled={
                        deletingId === snippet.id
                      }
                    >
                      {deletingId === snippet.id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </span>

                </div>

                <h3 className="resource-title">
                  {snippet.title}
                </h3>

                {snippet.description && (
                  <p className="resource-notes">
                    {snippet.description}
                  </p>
                )}

                {snippet.tags && (
                  <div className="snippet-tags">
                    {snippet.tags
                      .split(',')
                      .map((tag) => (
                        <span
                          key={tag.trim()}
                          className="snippet-tag"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                  </div>
                )}

                <pre className="code-block">
                  <code>
                    {snippet.code}
                  </code>
                </pre>
              </Card>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default SnippetsPage;