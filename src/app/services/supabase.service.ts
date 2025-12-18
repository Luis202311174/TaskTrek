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

  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password });
  }

  signUp(email: string, password: string, firstName: string, lastName: string) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    });
  }

  getUser() {
    return this.supabase.auth.getUser();
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: any) {
    const { data } = this.supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  }

  async getSessionUser() {
    const { data } = await this.supabase.auth.getUser();
    return data.user;
  }

  fetchTasks(userId: string) {
    return this.supabase.rpc('fetch_user_tasks', {
      p_user_id: userId
    });
  }

  createTask(data: any) {
    return this.supabase.rpc('create_task', data);
  }

  updateTask(
    table: string,
    taskId: string,
    updates: any
  ) {
    return this.supabase
      .from(table)
      .update(updates)
      .eq('id', taskId);
  }

  deleteTask(table: string, taskId: string, userId: string) {
    return this.supabase.rpc('delete_task', {
      p_table_name: table,
      p_task_id: taskId,
      p_user_id: userId
    });
  }
}
