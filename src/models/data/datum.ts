class Datum {
    name: string
    coefficent: number

    constructorForNewDatum(name: string, coefficent: number): Datum {
        this.name = name
        this.coefficent = coefficent

        return this
    }
}

export default Datum