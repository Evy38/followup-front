import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RelanceService {
    private readonly apiUrl = 'http://localhost:8080/api/relances';

    constructor(private http: HttpClient) { }

    markAsDone(relanceId: number) {
        return this.http.patch(
            `${this.apiUrl}/${relanceId}`,
            {
                faite: true,
                dateRealisation: new Date().toISOString(),
            },
            {
                headers: {
                    'Content-Type': 'application/merge-patch+json'
                }
            }
        );
    }

}
