export interface WorkoutType {
  id: string;
  sequence: number;
  name: string;
}

export interface WorkoutLog {
  id: string;
  sequence: number;
  date: string;
  workoutType: WorkoutType;
  minutes: number;
}

export interface WorkoutTypeResponse {
  data: WorkoutType[];
  meta: {
    count: number;
  };
}

export interface WorkoutLogResponse {
  data: WorkoutLog[];
  meta: {
    count: number;
  };
}

export interface CreateWorkoutTypeRequest {
  name: string;
}

export interface CreateWorkoutLogRequest {
  date: string;
  workoutType: WorkoutType;
  minutes: number;
}
