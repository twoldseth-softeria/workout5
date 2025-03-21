import { CreateWorkoutLogRequest, CreateWorkoutTypeRequest, WorkoutLogResponse, WorkoutTypeResponse } from '../types';

const API_URL = '/api';

// Error handler for fetch calls
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }
  
  if (response.status === 204) { // No content
    return null;
  }
  
  return response.json();
};

// Workout Type API
export const getWorkoutTypes = async (): Promise<WorkoutTypeResponse> => {
  const response = await fetch(`${API_URL}/workoutType`);
  return handleResponse(response);
};

export const getWorkoutTypeById = async (id: string) => {
  const response = await fetch(`${API_URL}/workoutType/${id}`);
  return handleResponse(response);
};

export const createWorkoutType = async (data: CreateWorkoutTypeRequest) => {
  const response = await fetch(`${API_URL}/workoutType`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateWorkoutType = async (id: string, data: CreateWorkoutTypeRequest) => {
  const response = await fetch(`${API_URL}/workoutType/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteWorkoutType = async (id: string) => {
  const response = await fetch(`${API_URL}/workoutType/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

// Workout Log API
export const getWorkoutLogs = async (): Promise<WorkoutLogResponse> => {
  const response = await fetch(`${API_URL}/workoutLog`);
  return handleResponse(response);
};

export const getWorkoutLogById = async (id: string) => {
  const response = await fetch(`${API_URL}/workoutLog/${id}`);
  return handleResponse(response);
};

export const createWorkoutLog = async (data: CreateWorkoutLogRequest) => {
  const response = await fetch(`${API_URL}/workoutLog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateWorkoutLog = async (id: string, data: CreateWorkoutLogRequest) => {
  const response = await fetch(`${API_URL}/workoutLog/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteWorkoutLog = async (id: string) => {
  const response = await fetch(`${API_URL}/workoutLog/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};
