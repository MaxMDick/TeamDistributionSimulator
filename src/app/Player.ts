export default class Player {
    readonly ID: string;
    constructor(public name: string = null, public shuffleable: boolean = null) {
        this.ID = this.createUniqueID();
    }

    private createUniqueID(): string {
        return '_' + Math.random().toString(36).substring(2, 9);
    }
}