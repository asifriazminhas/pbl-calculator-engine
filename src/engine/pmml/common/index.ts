export interface Extension {
    $: {
        name: string;
        value: string;
    }
}

export interface BasePmmlNode {
    Extension: Array<Extension> | Extension;
}