import { Injectable } from '@angular/core';
import { StorageData } from './storage-data';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public save(key: string, entity: any) {
    localStorage.removeItem(key);
    let data: StorageData = {
      key: key,
      expiresDate: moment(new Date()).add(4, 'hours').toDate(),
      entity: entity
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  public get(key: string, expired: boolean) {
    let data: StorageData = JSON.parse(localStorage.getItem(key));
    if (data == null || (moment(data.expiresDate).isBefore(moment(new Date())) && !expired)) {
      return null;
    }
    return data.entity;
  }

  public delete(key: string) {
    localStorage.removeItem(key);
  }

  public deleteAll() {
    localStorage.clear();
  }
}
