import { useEffect, useState } from 'react';
import api from '../api/client';

import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Card from '../components/Card';
import Badge from '../components/Badge';

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState('');

  const [editingTask, setEditingTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (statusFilter = 'all') => {
    try {
      setError('');
      setLoading(true);

      const response =
        statusFilter === 'all'
          ? await api.get('/tasks')
          : await api.get(
              `/tasks?status=${statusFilter}`
            );

      setTasks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to load tasks.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    const newStatus = event.target.value;

    setFilterStatus(newStatus);

    fetchTasks(newStatus);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError('');
      setCreating(true);

      if (editingTask) {
        const response = await api.put(
          `/tasks/${editingTask.id}`,
          {
            title,
            description,
            status,
            priority,
            project,
          }
        );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTask.id
              ? response.data
              : task
          )
        );

        setEditingTask(null);
      } else {
        const response = await api.post('/tasks', {
          title,
          description,
          status,
          priority,
          project,
        });

        if (
          filterStatus === 'all' ||
          response.data.status === filterStatus
        ) {
          setTasks((currentTasks) => [
            ...currentTasks,
            response.data,
          ]);
        }
      }

      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setProject('');

    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to save task.'
      );
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);

    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setProject(task.project);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);

    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setProject('');

    setError('');
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setError('');

      const response = await api.patch(
        `/tasks/${id}/status`,
        {
          status: newStatus,
        }
      );

      if (
        filterStatus === 'all' ||
        response.data.status === filterStatus
      ) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === id
              ? response.data
              : task
          )
        );
      } else {
        setTasks((currentTasks) =>
          currentTasks.filter(
            (task) => task.id !== id
          )
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to update task status.'
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');
      setDeletingId(id);

      await api.delete(`/tasks/${id}`);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Failed to delete task.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const statusOptions = [
    {
      value: 'todo',
      label: 'To Do',
    },
    {
      value: 'in-progress',
      label: 'In Progress',
    },
    {
      value: 'done',
      label: 'Done',
    },
  ];

  const priorityOptions = [
    {
      value: 'low',
      label: 'Low',
    },
    {
      value: 'medium',
      label: 'Medium',
    },
    {
      value: 'high',
      label: 'High',
    },
  ];

  const filterOptions = [
    {
      value: 'all',
      label: 'All Tasks',
    },
    ...statusOptions,
  ];

  const getStatusLabel = (taskStatus) => {
    const option = statusOptions.find(
      (item) => item.value === taskStatus
    );

    return option
      ? option.label
      : taskStatus;
  };

  const getPriorityVariant = (taskPriority) => {
    if (taskPriority === 'high') {
      return 'danger';
    }

    if (taskPriority === 'medium') {
      return 'warning';
    }

    return 'success';
  };

  const getStatusVariant = (taskStatus) => {
    if (taskStatus === 'done') {
      return 'success';
    }

    if (taskStatus === 'in-progress') {
      return 'warning';
    }

    return 'default';
  };

  const todoCount = tasks.filter(
    (task) => task.status === 'todo'
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === 'in-progress'
  ).length;

  const doneCount = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  return (
    <div className="page">

      {/* Page Header */}
      <header className="page-header">
        <div>
          <p className="page-eyebrow">
            Development Workflow
          </p>

          <h1 className="page-title">
            Tasks
          </h1>

          <p className="page-description">
            Track active development work, priorities
            and progress across your projects.
          </p>
        </div>

        <div className="task-summary">
          <div>
            <strong>{todoCount}</strong>
            <span>To Do</span>
          </div>

          <div>
            <strong>{inProgressCount}</strong>
            <span>In Progress</span>
          </div>

          <div>
            <strong>{doneCount}</strong>
            <span>Done</span>
          </div>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Add/Edit Task */}
      <Card className="form-card">
        <div className="section-heading">
          <div>
            <h2>
              {editingTask
                ? 'Edit Task'
                : 'Add a Task'}
            </h2>

            <p>
              {editingTask
                ? 'Update the selected development task.'
                : 'Create a task to keep your development work organized.'}
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
              id="task-title"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Build authentication page"
              required
            />

            <Select
              label="Status"
              id="task-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              options={statusOptions}
            />

            <Select
              label="Priority"
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              options={priorityOptions}
            />
          </div>

          <Input
            label="Project"
            id="task-project"
            value={project}
            onChange={(event) =>
              setProject(event.target.value)
            }
            placeholder="DevShelf Frontend"
          />

          <Textarea
            label="Description"
            id="task-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Describe what needs to be done..."
            rows={4}
          />

          <div className="form-actions">
            <Button
              type="submit"
              disabled={creating}
            >
              {creating
                ? 'Saving...'
                : editingTask
                  ? 'Save Changes'
                  : 'Add Task'}
            </Button>

            {editingTask && (
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

      {/* Task List */}
      <section className="resources-section">

        <div className="task-list-header">
          <div className="section-heading">
            <h2>Your Tasks</h2>

            <p>
              Keep track of what needs to be done.
            </p>
          </div>

          <div className="task-filter">
            <Select
              label="Filter"
              id="task-filter"
              value={filterStatus}
              onChange={handleFilterChange}
              options={filterOptions}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              ✓
            </div>

            <h3>
              No tasks found
            </h3>

            <p>
              Create a task to start tracking your
              development work.
            </p>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className="task-card"
              >
                <div className="task-card-top">

                  <Badge
                    variant={getStatusVariant(
                      task.status
                    )}
                  >
                    {getStatusLabel(task.status)}
                  </Badge>

                  <Badge
                    variant={getPriorityVariant(
                      task.priority
                    )}
                  >
                    {task.priority}
                  </Badge>

                </div>

                <h3 className="task-title">
                  {task.title}
                </h3>

                {task.description && (
                  <p className="task-description">
                    {task.description}
                  </p>
                )}

                {task.project && (
                  <div className="task-project">
                    <span>Project</span>
                    <strong>
                      {task.project}
                    </strong>
                  </div>
                )}

                <div className="task-status-control">
                  <Select
                    label="Update status"
                    id={`status-${task.id}`}
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(
                        task.id,
                        event.target.value
                      )
                    }
                    options={statusOptions}
                  />
                </div>

                <div className="task-actions">
                  <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                      handleEdit(task)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="text-button text-button-danger"
                    onClick={() =>
                      handleDelete(task.id)
                    }
                    disabled={
                      deletingId === task.id
                    }
                  >
                    {deletingId === task.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

      </section>
    </div>
  );
}

export default TasksPage;