import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-tasktrek',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasktrek.component.html'
})
export class TasktrekComponent implements OnInit {
  userId!: string;
  tasks: any[] = [];

  task = {
    p_table_name: 'assignments',
    p_user_id: '',
    p_title: '',
    p_description: '',
    p_priority: 'medium',
    p_subj_course: '',
    p_due_date: ''  
  };

  constructor(private supabase: SupabaseService) {}

  email = '';
  password = '';

  async login() {
    const { error } = await this.supabase.signIn(
      this.email,
      this.password
    );

    if (!error) {
      const { data } = await this.supabase.getUser();
      this.userId = data.user!.id;
      this.task.p_user_id = this.userId;
      this.loadTasks();
    }
  }

  async logout() {
    await this.supabase.supabase.auth.signOut();
    this.userId = '';
    this.tasks = [];
  }

  async ngOnInit() {
    const { data } = await this.supabase.getUser();
    if (data.user) {
      this.userId = data.user.id;
      this.task.p_user_id = this.userId;
      this.loadTasks();
    }
  }

  async loadTasks() {
    const { data } = await this.supabase.fetchTasks(this.userId);
    this.tasks = data || [];
  }

  async addTask() {
    await this.supabase.createTask(this.task);
    this.loadTasks();
  }

  async deleteTask(task: any) {
    await this.supabase.deleteTask(
      task.table_name,
      task.id,
      this.userId
    );
    this.loadTasks();
  }
}