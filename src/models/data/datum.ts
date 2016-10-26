class Datum {
    name: string
    coefficent: string | number

    constructorForNewDatum(name: string, coefficent: string | number): Datum {
        this.name = name
        this.coefficent = coefficent

        return this
    }
}

export default Datum