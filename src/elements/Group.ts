import IGroupOptions from './interface/IGroupOptions';
import ElementTypes from '../enums/ElementTypes';

import Element from './Element';

class Group extends Element {

    public constructor(options: IGroupOptions, type = ElementTypes.Group, ...values: any[]) {
        super(options, type, ...values);
    }

    public renderOldXML(parent: any, resources: any, global: any) {
        return super.renderOldXML(parent, resources, global, true);
    }

    public static isInstance(value: any) {
        return value instanceof Group;
    }
}

export default Group;
