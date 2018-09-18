import {Injectable} from '@angular/core';
import {ApiService} from '../../../utils/api.service';

@Injectable()
export class ClientListService {

  constructor(private apiService: ApiService) {
  }

  listAll(filter, sortColumn, sortOrder, pageNumber = 0, pageSize = 10) {
    return this
      .apiService
      .prep('client', 'listAll')
      .call({
        filter,
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize
      }, undefined, true);
  }
}
