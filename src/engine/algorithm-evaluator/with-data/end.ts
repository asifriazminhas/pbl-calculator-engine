export interface End<T extends object> {
    end: () => T;
}

export function getEnd<T extends object>(currentResult: T): End<T> {
    return {
        end: () => {
            return currentResult;
        }
    }
}