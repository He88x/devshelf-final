import { useEffect, useState } from 'react';
import api from '../api/client';

function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setCreating(true);

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

      setTitle('');
      setDescription('');
      setCode('');
      setLanguage('javascript');
      setTags('');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to create snippet.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <h1>Snippets</h1>

      {error && <p>{error}</p>}

      {/* CREATE SNIPPET */}
      <section>
        <h2>Add Snippet</h2>

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
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="code">
              Code
            </label>

            <textarea
              id="code"
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              rows="10"
              required
            />
          </div>

          <div>
            <label htmlFor="language">
              Language
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
            >
              <option value="javascript">
                JavaScript
              </option>

              <option value="typescript">
                TypeScript
              </option>

              <option value="jsx">
                JSX
              </option>

              <option value="python">
                Python
              </option>

              <option value="csharp">
                C#
              </option>

              <option value="java">
                Java
              </option>

              <option value="html">
                HTML
              </option>

              <option value="css">
                CSS
              </option>

              <option value="sql">
                SQL
              </option>

              <option value="other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="tags">
              Tags
            </label>

            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(event) =>
                setTags(event.target.value)
              }
              placeholder="react, hooks, frontend"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
          >
            {creating
              ? 'Saving...'
              : 'Add Snippet'}
          </button>
        </form>
      </section>

      {/* SNIPPET LIST */}
      <section>
        <h2>Your Snippets</h2>

        {loading ? (
          <p>Loading snippets...</p>
        ) : snippets.length === 0 ? (
          <p>No snippets found.</p>
        ) : (
          <div>
            {snippets.map((snippet) => (
              <article key={snippet.id}>
                <h3>{snippet.title}</h3>

                <p>
                  {snippet.description}
                </p>

                <p>
                  Language: {snippet.language}
                </p>

                <p>
                  Tags: {snippet.tags}
                </p>

                <pre>
                  <code>
                    {snippet.code}
                  </code>
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SnippetsPage;