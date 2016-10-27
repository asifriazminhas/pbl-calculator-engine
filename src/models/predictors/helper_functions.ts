export default {
    exp: function(value: number) {
        return Math.exp(value)
    },
    ln: function(value: number) {
        return Math.log(value)
    },
    'is.na': function(value: string) {
        return value === 'NA'
    },
    not: function(value: boolean) {
        return !value
    }
}