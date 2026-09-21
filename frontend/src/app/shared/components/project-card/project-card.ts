import { Component, input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss',
})
export class ProjectCard {
  readonly title = input.required<string>();

  readonly description = input.required<string>();

  readonly image = input<string>('');

  readonly technologies = input.required<string[]>();

  readonly githubUrl = input<string>('');

  readonly demoUrl = input<string>('');
}