import { Component } from '@angular/core';

@Component({
  selector: 'app-journey',
  imports: [],
  templateUrl: './journey.html',
  styleUrl: './journey.scss',
})
export class Journey {
  protected readonly journeyItems = [
    {
      period: '2026',
      type: 'Personal Project',
      title: 'Personal Portfolio + Blog',
      subtitle: 'Angular 22 · .NET 10 · MySQL',
      description:
        'Xây dựng website cá nhân Full-Stack để giới thiệu bản thân, quá trình học tập, công nghệ sử dụng, các dự án và nội dung kỹ thuật.',
    },
    {
      period: '2026',
      type: 'Learning Journey',
      title: 'Full-Stack Software Development',
      subtitle: 'Angular · C# · ASP.NET Core · REST API · MySQL',
      description:
        'Tập trung học và thực hành phát triển ứng dụng với Angular, C#, ASP.NET Core, REST API, MySQL và cách tổ chức project theo hướng thực tế.',
    },
    {
      period: '2022 — 2026',
      type: 'Education',
      title: 'Trường Đại học Công Thương TP.HCM (HUIT)',
      subtitle: 'Công nghệ thông tin',
      description:
        'Học nền tảng về lập trình, cơ sở dữ liệu, phát triển phần mềm và các kiến thức liên quan đến Công nghệ thông tin.',
    },
  ];
}