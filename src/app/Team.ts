import Player from './Player';

export default class Team {
    players: Player[] = [];
    
    constructor(public name: string = null, public acceptRandom: boolean = null) {}
    
    addPlayer(newPlayer: Player) {
        this.players.push(newPlayer);
    }

    // removePlayer(badPlayer: Player) {
    //     this.players.forEach( (elem, index) => {
    //         if(elem.ID === badPlayer.ID) {
    //             this.players.splice(index, 1);
    //         }
    //     });
    // }
}