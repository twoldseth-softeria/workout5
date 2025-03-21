import { FormEvent, useEffect, useState } from 'react';
import { CreateWorkoutLogRequest, WorkoutLog, WorkoutType } from '../types';
import { createWorkoutLog, updateWorkoutLog } from '../api';

interface WorkoutFormProps {
  workoutTypes: WorkoutType[];
  onSubmit: (workout: WorkoutLog) => void;
  onCancel: () => void;
  workout?: WorkoutLog | null;
}

const WorkoutForm = ({ workoutTypes, onSubmit, onCancel, workout }: WorkoutFormProps) => {
  const [formData, setFormData] = useState<CreateWorkoutLogRequest>({
    date: new Date().toISOString().split('T')[0],
    workoutType: { id: '', sequence: 0, name: '' },
    minutes: 30
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with workout data if editing
  useEffect(() => {
    if (workout) {
      setFormData({
        date: workout.date.split('T')[0],
        workoutType: workout.workoutType,
        minutes: workout.minutes
      });
    }
  }, [workout]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'workoutTypeId') {
      // Find the selected workout type
      const selectedType = workoutTypes.find(type => type.id === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          workoutType: selectedType
        }));
      }
    } else if (name === 'minutes') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (workout) {
        // Update existing workout
        response = await updateWorkoutLog(workout.id, formData);
      } else {
        // Create new workout
        response = await createWorkoutLog(formData);
      }

      // Construct the complete workout object to return
      // Note: In a real app, we'd use the response from the API
      // For this demo, we'll construct an object that matches the expected structure
      const newWorkout: WorkoutLog = {
        id: workout?.id || 'temp-' + Date.now(), // Use existing ID or generate temp ID
        sequence: workout?.sequence || 0,
        date: formData.date,
        workoutType: formData.workoutType,
        minutes: formData.minutes
      };

      onSubmit(newWorkout);
    } catch (err) {
      setError('Failed to save workout. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{workout ? 'Edit' : 'Add'} Workout</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="workoutTypeId">Workout Type</label>
              <select
                id="workoutTypeId"
                name="workoutTypeId"
                value={formData.workoutType.id}
                onChange={handleChange}
                required
              >
                <option value="">Select a workout type</option>
                {workoutTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="minutes">Duration (minutes)</label>
              <input
                type="number"
                id="minutes"
                name="minutes"
                min="1"
                max="720"
                value={formData.minutes}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
