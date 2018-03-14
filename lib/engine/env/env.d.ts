export declare function setEnvironmentToProduction(): void;
export declare function setEnvironmentToDevelopment(): void;
export declare function setEnvironmentToDebugging(): void;
export declare function isEnvironmentProduction(): boolean;
export declare function isEnvironmentDevelopment(): boolean;
export declare function isEnvironmentDebugging(): boolean;
export declare function shouldLogWarnings(): boolean;
export declare function shouldLogDebugInfo(): boolean;
export declare const env: {
    setEnvironmentToProduction: typeof setEnvironmentToProduction;
    setEnvironmentToDevelopment: typeof setEnvironmentToDevelopment;
    setEnvironmentToDebugging: typeof setEnvironmentToDebugging;
    isEnvironmentProduction: typeof isEnvironmentProduction;
    isEnvironmentDevelopment: typeof isEnvironmentDevelopment;
    isEnvironmentDebugging: typeof isEnvironmentDebugging;
};
