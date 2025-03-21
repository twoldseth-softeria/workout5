import { FormEvent, useEffect, useState } from 'react';
import { CreateWorkoutTypeRequest, WorkoutType } from '../types';
import { createWorkoutType, updateWorkoutType } from '../api';

interface WorkoutTypeFormProps {
  onSubmit: (workoutType: WorkoutType) => void;
  onCancel: () => void;
  workoutType?: WorkoutType | null;
}

const WorkoutTypeForm = ({ onSubmit, onCancel, workoutType }: WorkoutTypeFormProps) => {
  const [formData, setFormData] = useState<CreateWorkoutTypeRequest>({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with workout type data if editing
  useEffect(() => {
    if (workoutType) {
      setFormData({
        name: workoutType.name
      });
    }
  }, [workoutType]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (workoutType) {
        // Update existing workout type
        await updateWorkoutType(workoutType.id, formData);
      } else {
        // Create new workout type
        await createWorkoutType(formData);
      }

      // Construct the complete workout type object to return
      const newWorkoutType: WorkoutType = {
        id: workoutType?.id || 'temp-' + Date.now(), // Use existing ID or generate temp ID
        sequence: workoutType?.sequence || 0,
        name: formData.name
      };

      onSubmit(newWorkoutType);
    } catch (err) {
      setError('Failed to save workout type. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{workoutType ? 'Edit' : 'Add'} Workout Type</h2>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Running, Swimming, Weight Training"
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

export default WorkoutTypeForm;