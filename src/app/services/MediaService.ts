import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemGlobals } from '../models/SystemGlobals';

export interface UploadMediaResponse {
  id: number;
  activityId: string;
  identifier: string;
  readPointName: string;
  file: {
    originalName: string;
    mimeType: string;
    size: number;
    publicId: string;
  }
}

@Injectable({ providedIn: 'root' })
export class MediaService {
  // private baseUrl = SystemGlobals.API_URL; //'http://sockets.ronic.mx:5003'; // <-- ajusta si es necesario
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  // --- Configuración ---------------------------------------------------------
  setBaseUrl(url: string) { SystemGlobals.API_MEDIA_ENDPOINT = url.replace(/\/$/, ''); }
  setToken(jwt: string | null) { this.token = jwt; }
  // getToken(): string | null { return this.token; }

  // --- API Pública -----------------------------------------------------------
  /**
   * Sube un archivo (File) a /media/upload. Reporta progreso.
   */

  getToken(): Observable<{ token: string; expiresIn: number }> {
    const apiKey = SystemGlobals.API_MEDIA_KEY;
    return this.http.post<{ token: string; expiresIn: number }>(
      `${SystemGlobals.API_MEDIA_ENDPOINT}${SystemGlobals.API_MEDIA_GET_TOKEN}`,
      { apiKey },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }


  uploadFile(input: {
    activityId: string;
    identifier: string;
    readPointName: string;
    file: File;
  }): Observable<HttpEvent<UploadMediaResponse>> {
    const form = new FormData();
    form.append('activityId', input.activityId);
    form.append('identifier', input.identifier);
    form.append('readPointName', input.readPointName);
    form.append('file', input.file, input.file.name);

    const headers = this.buildAuthHeaders(); // NO fijes Content-Type con FormData
    const req = new HttpRequest('POST', `${SystemGlobals.API_MEDIA_ENDPOINT}${SystemGlobals.API_MEDIA_UPLOAD}`, form, {
      reportProgress: true,
      headers
    });
    return this.http.request<UploadMediaResponse>(req);
  }

  /**
   * Sube contenido en Base64 (dataURL o base64 “puro” + mime) convirtiéndolo a File.
   */
  uploadBase64(input: {
    activityId: string;
    identifier: string;
    readPointName: string;
    base64: string;          // puede ser "data:image/png;base64,...." o solo el payload
    filename?: string;       // ej: "captura.png" (opcional, hará uno por defecto)
    mimeType?: string;       // obligatorio solo si base64 viene SIN el prefijo data:
  }): Observable<HttpEvent<UploadMediaResponse>> {
    const file = this.base64ToFile(input.base64, input.filename, input.mimeType);
    return this.uploadFile({
      activityId: input.activityId,
      identifier: input.identifier,
      readPointName: input.readPointName,
      file
    });
  }

  // --- Utilidades privadas ---------------------------------------------------
  private buildAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (this.token) headers = headers.set('Authorization', `Bearer ${this.token}`);
    return headers;
  }

  /**
   * Convierte base64 (con o sin prefijo data:) a File.
   */
  private base64ToFile(base64: string, filename?: string, mimeFromArg?: string): File {
    let mime = mimeFromArg || 'application/octet-stream';
    let data = base64;

    // Si viene como dataURL: "data:image/png;base64,AAAA..."
    const hasDataUrl = base64.startsWith('data:');
    if (hasDataUrl) {
      const [meta, payload] = base64.split(',');
      const m = /data:(.*?);base64/.exec(meta || '');
      if (m && m[1]) mime = m[1];
      data = payload || '';
    }

    const bin = atob(data);
    const len = bin.length;
    const u8 = new Uint8Array(len);
    for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);

    // Nombre por defecto si no lo pasas
    const name = filename || this.defaultFilenameFromMime(mime);
    return new File([u8], name, { type: mime });
  }

  private defaultFilenameFromMime(mime: string): string {
    const ext = ({
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'application/pdf': 'pdf'
    } as Record<string, string>)[mime] || 'bin';
    return `upload.${ext}`;
  }
}
