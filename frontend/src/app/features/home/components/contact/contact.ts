import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactApiService } from '../../../../core/api/contact-api.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private readonly contactApi = inject(ContactApiService);

  protected readonly githubUrl = 'https://github.com/TM-Luan';

  protected readonly linkedinUrl = '';

  protected readonly email = '';

  protected readonly contactForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.maxLength(254),
      ],
    }),

    message: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(5000),
      ],
    }),
  });

  protected readonly isSubmitting = signal(false);
  protected readonly submitSuccess = signal('');
  protected readonly submitError = signal('');

  protected submit(): void {
    this.submitSuccess.set('');
    this.submitError.set('');

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.contactApi.createMessage(this.contactForm.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.contactForm.reset();
        this.submitSuccess.set('Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);
        this.submitError.set(this.getSubmitError(error));
      },
    });
  }

  private getSubmitError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Không thể kết nối máy chủ. Vui lòng thử lại sau.';
    }

    if (error.status === 429) {
      return 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một phút rồi thử lại.';
    }

    if (error.status === 400) {
      return 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại các trường thông tin.';
    }

    return 'Không thể gửi tin nhắn lúc này. Vui lòng thử lại sau.';
  }
}
