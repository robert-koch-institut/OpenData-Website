import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contributorRoleLabel'
})
export class ContributorRoleLabelPipe implements PipeTransform {

  private mapping = new Map<string, string>([
    ['DataCurator', 'Datenkuration'],
    ['DataManager', 'Datenverwaltung'],
    ['ProjectLeader', 'Projektleitung'],
    ['ProjectManager', 'Projektmanagement'],
    ['Researcher', 'Forschung']
  ]);

  transform(value: string, ...args: never[]): string {

    return this.mapping.has(value) ? this.mapping.get(value)! : value;
  }

}
