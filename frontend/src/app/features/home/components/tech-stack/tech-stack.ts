import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-stack',
  imports: [],
  templateUrl: './tech-stack.html',
  styleUrl: './tech-stack.scss',
})
export class TechStack {
  protected readonly techGroups = [
    {
      name: 'Frontend',
      technologies: [
        {
          name: 'Angular',
          icon: '/icons/tech/angular.svg',
        },
        {
          name: 'TypeScript',
          icon: '/icons/tech/typescript.svg',
        },
        {
          name: 'HTML',
          icon: '/icons/tech/html.svg',
        },
        {
          name: 'SCSS',
          icon: '/icons/tech/scss.svg',
        },
      ],
    },
    {
      name: 'Backend',
      technologies: [
        {
          name: 'C#',
          icon: '/icons/tech/csharp.svg',
        },
        {
          name: '.NET',
          icon: '/icons/tech/dotnet.svg',
        },
        {
          name: 'ASP.NET Core',
          icon: '/icons/tech/aspnet-core.svg',
        },
      ],
    },
    {
      name: 'Database',
      technologies: [
        {
          name: 'MySQL',
          icon: '/icons/tech/mysql.svg',
        },
      ],
    },
    {
      name: 'Tools',
      technologies: [
        {
          name: 'Git',
          icon: '/icons/tech/git.svg',
        },
        {
          name: 'GitHub',
          icon: '/icons/tech/github.svg',
        },
      ],
    },
  ];
}