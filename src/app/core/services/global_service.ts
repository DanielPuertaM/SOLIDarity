import { Injectable } from '@angular/core';
import { WORDS } from '../constants/words.constant';
import { API_URLS } from '../constants/api_urls.constant';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  API_URLS = API_URLS;
  WORDS = WORDS;
}
