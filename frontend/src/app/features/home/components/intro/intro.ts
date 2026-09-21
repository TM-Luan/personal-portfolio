import { Component } from '@angular/core';

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.html',
  styleUrl: './intro.scss',
})
export class Intro {
  protected readonly name = 'Trần Minh Luân';

  protected readonly title = 'Software Engineer';

  protected readonly description =
    'Tôi là một Software Engineer, tập trung xây dựng các ứng dụng web và phần mềm thực tế. Đây là nơi tôi giới thiệu bản thân, kinh nghiệm, công nghệ tôi sử dụng và những dự án tôi đã xây dựng.';

  protected readonly githubUrl = 'https://github.com/TM-Luan';

  protected readonly linkedinUrl = '';
}