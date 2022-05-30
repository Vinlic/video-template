import ISubtitleOptions from './interface/ISubtitleOptions';
import ElementTypes from '../enums/ElementTypes';

import Text from './Text';

class Subtitle extends Text {

    public constructor(options: ISubtitleOptions, type = ElementTypes.Subtitle, ...values: any[]) {
        super(options, ElementTypes.Subtitle, ...values);
    }

    public static isInstance(value: any) {
        return value instanceof Subtitle;
    }
}

export default Subtitle;
