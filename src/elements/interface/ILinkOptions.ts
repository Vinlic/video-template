import IElementOptions from './IElementOptions';

interface ILinkOptions extends IElementOptions {
    __type?: string;
    target?: string;
    trigger?: string;
    modal?: any;
    params?: any;
    enter?: any;
    exit?: any;
}

export default ILinkOptions;
