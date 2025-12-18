import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-tasktrek',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasktrek.component.html',
})
export class TasktrekComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  userId = '';
  userName = '';
  tasks: any[] = [];
  editingTask: any | null = null;

  private authListener: { unsubscribe: () => void } | null = null;

  showLogin = false;
  showSignup = false;

  email = '';
  password = '';
  firstName = '';
  lastName = '';
  signupEmail = '';
  signupPassword = '';

  task = {
    p_table_name: 'assignments',
    p_user_id: '',
    p_title: '',
    p_description: '',
    p_priority: 'medium',
    p_subj_course: '',
    p_due_date: ''
  };

  resetForm() {
    this.task = {
      p_table_name: 'assignments',
      p_user_id: this.userId,
      p_title: '',
      p_description: '',
      p_priority: 'medium',
      p_subj_course: '',
      p_due_date: ''
    };
  }

  constructor(private supabase: SupabaseService) {}
  
  async ngOnInit() {
    try {
      const { data } = await this.supabase.getSession();
      console.log('Session data', data);
      if (data.session?.user) {
        this.setUser(data.session.user);
        this.loadTasks();
      }

      this.authListener = this.supabase.onAuthStateChange(
        (_event: any, session: any) => {
          console.log('Auth change', session);
          if (session?.user) {
            this.setUser(session.user);
            this.showLogin = false;
            this.showSignup = false;
            this.loadTasks();
          } else {
            this.clearUser();
          }
        }
      );
    } catch (err) {
      console.error('ngOnInit error', err);
    }
  }

  ngOnDestroy() {
    this.authListener?.unsubscribe();
  }

  async login() {
    const { error } = await this.supabase.signIn(this.email, this.password);
    if (!error) {
      this.showLogin = false;
    }
  }

  async signup() {
    const { error } = await this.supabase.signUp(
      this.signupEmail,
      this.signupPassword,
      this.firstName,
      this.lastName
    );

    if (!error) {
      this.showSignup = false;
    }
  }

  async logout() {
    await this.supabase.supabase.auth.signOut();
    this.clearUser();
  }

  setUser(user: any) {
    this.userId = user.id;
    this.task.p_user_id = user.id;

    const meta = user.user_metadata || {};
    this.userName =
      `${meta.first_name || ''} ${meta.last_name || ''}`.trim() ||
      user.email;
  }

  clearUser() {
    this.userId = '';
    this.userName = '';
    this.tasks = [];
  }

  async loadTasks() {
    try {
      const { data, error } = await this.supabase.fetchTasks(this.userId);
      if (error) {
        console.error('failed to fetch tasks', error);
        this.tasks = [];
        return;
      }
      this.tasks = data || [];
    } catch (err) {
      console.error('error fetching tasks', err);
      this.tasks = [];
    }
  }

  async addTask() {
    if (!this.task.p_title) return;

    const priorityMap: Record<string, string> = {
      low: 'Low Priority',
      medium: 'Medium Priority',
      high: 'High Priority'
    };

    const taskData = {
      p_table_name: this.task.p_table_name,
      p_user_id: this.task.p_user_id,
      p_title: this.task.p_title,
      p_description: this.task.p_description || null,
      p_priority: priorityMap[this.task.p_priority.toLowerCase()] || 'Medium Priority',
      p_subj_course: this.task.p_subj_course || null,
      p_due_date: this.task.p_due_date || null
    };

    try {
      const { error } = await this.supabase.createTask(taskData);
      if (error) {
        console.error('failed to create task', error);
        return;
      }
      await this.loadTasks();
    } catch (err) {
      console.error('error creating task', err);
    }

    await this.loadTasks();
    this.resetForm();
  }

  startEdit(task: any) {
    console.log('edit log:', task);
    this.editingTask = task;

    this.task = {
      p_table_name: task.table_name,
      p_user_id: this.userId,
      p_title: task.task_title,
      p_description: task.task_description,
      p_priority: task.task_priority.toLowerCase().includes('high')
        ? 'high'
        : task.task_priority.toLowerCase().includes('low')
        ? 'low'
        : 'medium',
      p_subj_course: task.task_subj_course,
      p_due_date: task.task_due_date
    };
  }

  async updateTask() {
    if (!this.editingTask?.task_id) {
      console.error('Missing task_id', this.editingTask);
      return;
    }

    const updates = {
      title: this.task.p_title,
      description: this.task.p_description || null,
      priority:
        this.task.p_priority === 'high'
          ? 'High Priority'
          : this.task.p_priority === 'low'
          ? 'Low Priority'
          : 'Medium Priority',
      subj_course: this.task.p_subj_course || null,
      due_date: this.task.p_due_date || null
    };

    const { error } = await this.supabase.updateTask(
      this.editingTask.table_name,
      this.editingTask.task_id,
      updates
    );

    if (error) {
      console.error('failed to update task', error);
      return;
    }

    this.editingTask = null;
    this.resetForm();
    await this.loadTasks();
  }

  async deleteTask(task: any) {
    if (!task.task_id) {
      console.error('missing task_id', task);
      return;
    }

    await this.supabase.deleteTask(
      task.table_name,
      task.task_id,
      this.userId
    );

    await this.loadTasks();
  }
}
