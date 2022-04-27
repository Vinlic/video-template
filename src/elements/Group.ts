import IGroupOptions from './interface/IGroupOptions';
import ElementTypes from '../enums/ElementTypes';

import Element from './Element';

class Group extends Element {

    public constructor(options: IGroupOptions) {
        super(options, ElementTypes.Group);
    }

    public static isInstance(value: any) {
        return value instanceof Group;
    }
}

export default Group;
