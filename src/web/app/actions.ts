'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export type TaskStats = {
  total: number;
  completed: number;
  pending: number;
};

// Health check types
export type HealthCheckStatus = 'healthy' | 'unhealthy' | 'unknown';

export type DatabaseCheck = {
  status: HealthCheckStatus;
  responseTime: number | null;
  poolSize?: number;
  idleCount?: number;
  error?: string;
};

export type MemoryCheck = {
  heapUsed: number;
  heapTotal: number;
  external: number;
  rss: number;
};

export type CpuCheck = {
  cores: number;
  model: string;
  loadAverage: {
    oneMinute: number;
    fiveMinutes: number;
    fifteenMinutes: number;
  };
};

export type HealthChecks = {
  database: DatabaseCheck;
  memory: MemoryCheck;
  cpu: CpuCheck;
};

export type ApiState = {
  status: HealthCheckStatus;
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  nodeVersion: string;
  responseTime: number;
  checks: HealthChecks;
};

export async function getTasks(): Promise<Task[]> {
  const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function getTaskStats(): Promise<TaskStats> {
  const res = await fetch(`${API_URL}/tasks/stats`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getApiState(): Promise<ApiState> {
  const res = await fetch(`${API_URL}/healthState`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch API state');
  return res.json();
}

export async function createTask(formData: FormData) {
  const title = formData.get('title') as string;
  await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  revalidatePath('/');
}

export async function toggleTask(id: number, completed: boolean) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  revalidatePath('/');
}

export async function deleteTask(id: number) {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  revalidatePath('/');
}
