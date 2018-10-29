import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  file = null;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formdata: FormData = new FormData();

    formdata.append('filename', file);

    const req = new HttpRequest('POST', '/api/files', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req).pipe(
      tap((event: HttpEvent<{}>) => console.log('event', event)),
      filter((event: HttpEvent<{}>) => event.type === 4),
      map((event: HttpResponse<string>) => event.body)
    );
  }

  getFiles(): Observable<string[]> {
    return this.http.get('api/files').pipe(map((x: string[]) => x));
  }

  get(id: string): Promise<string> {
    return this.http
      .get('api/files/' + id, { responseType: 'text' })
      .pipe(map((x: string) => x))
      .toPromise();
  }
}
