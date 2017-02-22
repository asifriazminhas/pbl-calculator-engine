import { Header } from './interfaces/pmml';

/**
 * 
 * 
 * @export
 * @param {Header} header 
 * @returns {string} 
 */
export function parseVersionFromDescription(header: Header): string {
    //The description field is provided as cvdport_0.1 where 0.1 is the version
    const parsedDescription = header.$.description.split('_')[1];

    if(parsedDescription.trim().length === 0) {
        return 'No version provided';
    }
    else {
        return parsedDescription;
    }
}