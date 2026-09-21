import { Component } from '@angular/core';
import { ProjectCard } from '../../../../shared/components/project-card/project-card';

@Component({
  selector: 'app-featured-projects',
  imports: [ProjectCard],
  templateUrl: './featured-projects.html',
  styleUrl: './featured-projects.scss',
})
export class FeaturedProjects {
  protected readonly projects = [
    {
      title: 'Personal Portfolio + Blog',

      description:
        'Website cá nhân Full-Stack được xây dựng để giới thiệu bản thân, quá trình học tập, công nghệ sử dụng, các dự án và nội dung kỹ thuật.',

      image: '',

      technologies: [
        'Angular 22',
        '.NET 10',
        'MySQL',
      ],

      githubUrl: '',

      demoUrl: '',
    },
  ];
}