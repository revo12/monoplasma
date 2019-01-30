const BN = require("bn.js")
const {utils: { isAddress }} = require("web3")

class MonoplasmaMember {
    constructor(name, address, earnings) {
        this.name = name || ""
        this.address = MonoplasmaMember.validateAddress(address)
        this.earnings = earnings ? new BN(earnings) : new BN(0)
        this.active = true
    }

    getEarningsAsString() {
        return this.earnings.toString()
    }

    getEarningsAsInt() {
        return this.earnings.toNumber()
    }

    addRevenue(amount) {
        this.earnings = this.earnings.add(new BN(amount))
    }

    isActive() {
        return this.active
    }

    /**
     * @param {boolean} activeState true if active, false if not going to be getting revenues
     */
    setActive(activeState) {
        this.active = activeState
    }

    toObject() {
        const obj = {
            address: this.address,
            earnings: this.earnings.toString(),
        }
        if (this.name) {
            obj.name = this.name
        }
        return obj
    }

    /** Produces a hashable string representation in hex form (starts with "0x") */
    toStringData() {
        return this.address + this.earnings.toString(16, 64)
    }

    getProof(tree) {
        return this.earnings.gt(new BN(0)) ? tree.getPath(this.address) : []
    }

    static validateAddress(address) {
        let extended = address
        if (address.length === 40) {
            extended = `0x${address}`
        }
        if (!isAddress(extended)) {
            throw new Error(`Bad Ethereum address: ${address}`)
        }
        return extended
    }
}

module.exports = MonoplasmaMember