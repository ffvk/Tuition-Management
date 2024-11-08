import { IResource } from './interfaces';

export class ResourceConstant {
  //*****************************************************************//
  //*************************ORGANIZATIONS***************************//
  //*****************************************************************//

  /**
   * @description Resource that captures the request to get (*) organizations
   * @constant
   * @type {Object} GET_ORGANIZATIONS
   * @default
   */
  public static readonly GET_ORGANIZATIONS: IResource = {
    action: 'GET_ORGANIZATIONS',
    resource: 'ORGANIZATIONS',
    verb: 'GET',
    endpoint: '/organizations',
    signWith: 'TOKEN',
    type: 'READ',
    name: 'List All organizations',
    description: 'Allows retrieving the list of all organizations',
  };

  private constructor() {}
}
