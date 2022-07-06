import * as _ from 'lodash';
import { DatasourceContent } from '../models/datasource';

export class DatasourceHelper {
    static ContentOrder = ['folder', 'file'] as const;
    static orderContent(content: DatasourceContent[]): DatasourceContent[] {
        return _.orderBy(content, x => `${DatasourceHelper.ContentOrder.indexOf(x.$type)}_${x.name}`);
    }
}