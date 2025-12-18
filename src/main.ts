import { bootstrapApplication } from '@angular/platform-browser';
import { TasktrekComponent } from './app/pages/tasktrek/tasktrek.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

bootstrapApplication(TasktrekComponent, {
  providers: [
    importProvidersFrom(CommonModule, FormsModule)
  ]
}).catch(err => console.error(err));
