import { Pmml } from './pmml';
export declare class PmmlParser {
    static parsePmmlFromPmmlXmlStrings(pmmlXmlStrings: Array<string>): Promise<Pmml>;
}
