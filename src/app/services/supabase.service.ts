import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // AUTH
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  // TASKS
  fetchTasks(userId: string) {
    return this.supabase.rpc('fetch_user_tasks', {
      p_user_id: userId
    });
  }

  createTask(data: any) {
    return this.supabase.rpc('create_task', data);
  }

  updateTask(data: any) {
    return this.supabase.rpc('update_task', data);
  }

  deleteTask(table: string, taskId: string, userId: string) {
    return this.supabase.rpc('delete_task', {
      p_table_name: table,
      p_task_id: taskId,
      p_user_id: userId
    });
  }
}
