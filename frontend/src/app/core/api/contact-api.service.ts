import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CreateContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/contact-messages';

  createMessage(
    request: CreateContactMessageRequest,
  ): Observable<ContactMessageResponse> {
    return this.http.post<ContactMessageResponse>(this.endpoint, request);
  }
}
