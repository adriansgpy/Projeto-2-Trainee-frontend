import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LlmService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  startChapter(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/start_chapter`, payload);
  }

  turn(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/turn`, payload);
  }
}
