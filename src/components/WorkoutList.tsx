import { useEffect, useState } from 'react';
import { WorkoutLog, WorkoutType } from '../types';
import { deleteWorkoutLog, deleteWorkoutType, getWorkoutLogs, getWorkoutTypes } from '../api';
import WorkoutForm from './WorkoutForm';
import WorkoutTypeForm from './WorkoutTypeForm';

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editWorkout, setEditWorkout] = useState<WorkoutLog | null>(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editWorkoutType, setEditWorkoutType] = useState<WorkoutType | null>(null);
  const [activeTab, setActiveTab] = useState<'workouts' | 'types'>('workouts');

  // Fetch workout logs and types
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [workoutResponse, typeResponse] = await Promise.all([
          getWorkoutLogs(),
          getWorkoutTypes()
        ]);
        setWorkouts(workoutResponse.data);
        setWorkoutTypes(typeResponse.data);
      } catch (err) {
        setError('Failed to load workouts. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle workout deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkoutLog(id);
        setWorkouts(workouts.filter(workout => workout.id !== id));
      } catch (err) {
        setError('Failed to delete workout. Please try again.');
        console.error(err);
      }
    }
  };

  // Handle workout form submission (for both add and edit)
  const handleWorkoutFormSubmit = (newWorkout: WorkoutLog) => {
    if (editWorkout) {
      // Update existing workout in the list
      setWorkouts(workouts.map(w => w.id === editWorkout.id ? newWorkout : w));
      setEditWorkout(null);
    } else {
      // Add new workout to the list
      setWorkouts([...workouts, newWorkout]);
      setShowAddForm(false);
    }
  };

  // Handle workout type form submission (for both add and edit)
  const handleTypeFormSubmit = (newType: WorkoutType) => {
    if (editWorkoutType) {
      // Update existing workout type in the list
      setWorkoutTypes(types => types.map(t => t.id === editWorkoutType.id ? newType : t));
      setEditWorkoutType(null);
    } else {
      // Add new workout type to the list
      setWorkoutTypes([...workoutTypes, newType]);
      setShowTypeForm(false);
    }
  };

  // Handle workout edit button click
  const handleEditWorkout = (workout: WorkoutLog) => {
    setEditWorkout(workout);
  };

  // Handle workout type edit button click
  const handleEditType = (type: WorkoutType) => {
    setEditWorkoutType(type);
  };

  // Handle workout type deletion
  const handleDeleteType = async (id: string) => {
    // Check if type is in use by any workout
    const typeInUse = workouts.some(workout => workout.workoutType.id === id);
    
    if (typeInUse) {
      alert('Cannot delete this workout type because it is used by existing workouts.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this workout type?')) {
      try {
        await deleteWorkoutType(id);
        setWorkoutTypes(workoutTypes.filter(type => type.id !== id));
      } catch (err) {
        setError('Failed to delete workout type. Please try again.');
        console.error(err);
      }
    }
  };

  // Close any open workout form
  const handleWorkoutFormClose = () => {
    setShowAddForm(false);
    setEditWorkout(null);
  };

  // Close any open workout type form
  const handleTypeFormClose = () => {
    setShowTypeForm(false);
    setEditWorkoutType(null);
  };

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <div style={{ marginBottom: '1rem' }}>
        <div>
          {activeTab === 'workouts' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(true)}
            >
              Add Workout
            </button>
          )}
          {activeTab === 'types' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setShowTypeForm(true)}
            >
              Add Workout Type
            </button>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
        <button
          style={{
            padding: '0.75rem 1rem',
            fontWeight: 500,
            borderBottom: activeTab === 'workouts' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'workouts' ? 'var(--color-primary)' : 'inherit',
            marginRight: '1rem'
          }}
          onClick={() => setActiveTab('workouts')}
        >
          Workouts
        </button>
        <button
          style={{
            padding: '0.75rem 1rem',
            fontWeight: 500,
            borderBottom: activeTab === 'types' ? '2px solid var(--color-primary)' : 'none',
            color: activeTab === 'types' ? 'var(--color-primary)' : 'inherit'
          }}
          onClick={() => setActiveTab('types')}
        >
          Workout Types
        </button>
      </div>

      {/* Workout Form Modal */}
      {(showAddForm || editWorkout) && (
        <WorkoutForm 
          workoutTypes={workoutTypes}
          onSubmit={handleWorkoutFormSubmit}
          onCancel={handleWorkoutFormClose}
          workout={editWorkout}
        />
      )}

      {/* Workout Type Form Modal */}
      {(showTypeForm || editWorkoutType) && (
        <WorkoutTypeForm 
          onSubmit={handleTypeFormSubmit}
          onCancel={handleTypeFormClose}
          workoutType={editWorkoutType}
        />
      )}

      {/* Workouts Tab Content */}
      {activeTab === 'workouts' && (
        <>
          {/* Empty state */}
          {workouts.length === 0 && !loading && (
            <div className="empty-state">
              <h3>No workouts yet</h3>
              <p>Add your first workout to get started!</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddForm(true)}
              >
                Add Workout
              </button>
            </div>
          )}

          {/* Workout list */}
          {workouts.length > 0 && (
            <div className="workout-list">
              {workouts.map(workout => (
                <div key={workout.id} className="card workout-card">
                  <div className="workout-card__header">
                    <div className="workout-card__title">{workout.workoutType.name}</div>
                    <div className="workout-card__date">{formatDate(workout.date)}</div>
                  </div>
                  <div className="workout-card__minutes">
                    <strong>Duration:</strong> {workout.minutes} minutes
                  </div>
                  <div className="workout-card__actions">
                    <button 
                      className="btn btn-sm btn-outline" 
                      onClick={() => handleEditWorkout(workout)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDelete(workout.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Workout Types Tab Content */}
      {activeTab === 'types' && (
        <>
          {/* Empty state */}
          {workoutTypes.length === 0 && !loading && (
            <div className="empty-state">
              <h3>No workout types yet</h3>
              <p>Add your first workout type to get started!</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowTypeForm(true)}
              >
                Add Workout Type
              </button>
            </div>
          )}

          {/* Workout type list */}
          {workoutTypes.length > 0 && (
            <div className="workout-list">
              {workoutTypes.map(type => (
                <div key={type.id} className="card workout-card">
                  <div className="workout-card__header">
                    <div className="workout-card__title">{type.name}</div>
                  </div>
                  <div className="workout-card__actions">
                    <button 
                      className="btn btn-sm btn-outline" 
                      onClick={() => handleEditType(type)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger" 
                      onClick={() => handleDeleteType(type.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutList;
