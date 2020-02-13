import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VugasiConnectionService {
  url = environment.vugasiUrl + '/';

  getUrl(endpoint: string) {
    return this.url + endpoint;
  }

  constructor(private http: HttpClient) {
  }

  getGamesList() {
    return this.http.get(this.getUrl('config/games'));
  }
}

