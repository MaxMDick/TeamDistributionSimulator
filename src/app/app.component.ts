import { Component } from '@angular/core';
import Team from './Team';
import Player from './Player';
import Names from './Names';
import { first } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'TeamSimulator';
	maxPerTeam: number = 6;
	targetMinPerTeam: number = 3;
	names: Names = new Names();
	teams: Team[] = [];
	queue: Player[] = [];
	teamsDone: boolean = false;
	initialQueueLength: number = 0;
	initialOpenSpots: number = 0;
	totalPlayers: Player[] = [];
	numInTeams: number = 0;

	newTeam(fill: boolean = false, firstPlayer: Player = null): void {
		let tempName: string = `Team ${this.names.getAnimalName()}`;
		let tempTeam: Team = new Team(tempName, true);
		this.teams.push(tempTeam);

		if(firstPlayer !== null) {
			tempTeam.addPlayer(firstPlayer);
			tempTeam.acceptRandom = true;
		} else if (fill === true) {
			for(let i=0; i<(Math.floor(Math.random() * this.maxPerTeam) + 1); i++) {
				this.newPlayer(this.teams.length - 1, false);
			}
		}
		
		this.update();
	}

	newPlayer(teamIndex: number = null, shuffleable: boolean = true): void {
		let tempName: string = this.names.getHumanName();
		let tempPlayer: Player = new Player(tempName, shuffleable);
		this.totalPlayers.push(tempPlayer);
		if(teamIndex === null) {
			this.queue.push(tempPlayer);
			this.initialQueueLength++;
		} else {
			this.teams[teamIndex].addPlayer(tempPlayer);
			this.numInTeams++;
		}
		
		this.update();
	}

	distributeOne(): void {
		if(this.teamsDone === false) {
			this.manageNewTeams();
			this.teamsDone = true;
		}

		let minTeamIndex: number = this.findMinTeam();

		this.teams[minTeamIndex].addPlayer(this.queue[0]);
		
		this.numInTeams++;
		let ignore: Player = this.queue.shift();

		this.update();
	}

 	distributeAll(): void {
		this.teamsDone = false;
		this.initialOpenSpots = (this.teams.length * this.maxPerTeam) - this.numInTeams;
		this.initialQueueLength = this.queue.length;
		
		while(this.queue.length > 0) {
			this.distributeOne();
		}

		this.update();
	}

	private findMinTeam(): number {
		let minTeam: number = this.teams[0].players.length;
		let minTeamIndex: number = 0;
		for(let i=0; i<this.teams.length; i++) {
			if(this.teams[i].players.length < minTeam && this.teams[i].players.length < this.maxPerTeam) {
				minTeam = this.teams[i].players.length;
				minTeamIndex = i;
			}
		}
		// console.log(`minTeam: ${minTeamIndex}`);
		return minTeamIndex;
	}

	private findMaxTeam(): number {
		let maxTeam: number = this.teams[0].players.length;
		let maxTeamIndex: number = 0;
		for(let i=0; i<this.teams.length; i++) {
			if(this.teams[i].players.length > maxTeam && this.teams[i].players.length < this.maxPerTeam) {
				maxTeam = this.teams[i].players.length;
				maxTeamIndex = i;
			}
		}
		// console.log(`minTeam: ${maxTeamIndex}`);
		return maxTeamIndex;
	}

	private manageNewTeams(): void {
		// console.log(`initialQueueLength: ${this.initialQueueLength}`);
		let numNewTeams:number = Math.ceil((this.initialQueueLength - this.initialOpenSpots) / this.maxPerTeam);
		if(numNewTeams < 0) numNewTeams = 0;
		for(let i=0; i<numNewTeams; i++) {
			if(numNewTeams === 0) break;
			this.newTeam();
		}
		console.log(`newTeams: ${numNewTeams}`);
	}

	addTenPlayers() {
		for(let i=0; i<10; i++) {
			this.newPlayer();
		}

		this.update();
	}

	private update(): void { //update html elements (start from scratch each time)
		let teamHolder = document.getElementById('teamHolder');

		//remove old html elements in teamHolder
		let child1 = teamHolder.lastElementChild; 
		while (child1) {
			teamHolder.removeChild(child1);
			child1 = teamHolder.lastElementChild;
		}

		this.teams.forEach(team => {
			if(team.players.length >= this.maxPerTeam) {
				team.acceptRandom = false;
			}

			let teamDiv = document.createElement('div');
			let teamName = document.createElement('h1');
			let playersDiv = document.createElement('div');

			teamName.innerText = `${team.name}: ${team.players.length}`;
			if(team.acceptRandom === true) {
				teamDiv.style.background = 'lightGreen';
			} else {
				teamDiv.style.background = 'lightCoral';
			}

			team.players.forEach(player => {
				let playerDiv = document.createElement('div');
				playerDiv.setAttribute('class', 'player');
				let playerName = document.createElement('p');
				playerName.setAttribute('class', 'playerP');
				

				playerName.innerText = player.name;
				if(player.shuffleable === true) {
					playerDiv.style.background = 'lightGreen';
				} else {
					playerDiv.style.background = 'lightCoral';
				}

				playerDiv.appendChild(playerName);
				playersDiv.appendChild(playerDiv);
			})
			
			teamDiv.appendChild(teamName);
			teamDiv.appendChild(playersDiv);
			teamHolder.appendChild(teamDiv);
		})

		let queueHolder = document.getElementById('queueHolder');
		let child2 = queueHolder.lastElementChild; 
		while (child2) {
			queueHolder.removeChild(child2);
			child2 = queueHolder.lastElementChild;
		}
		this.queue.forEach(player => {
			let playerDiv = document.createElement('div');
			playerDiv.setAttribute('class', 'playerDiv');
			let playerName = document.createElement('p');

			playerName.innerText = player.name;

			playerDiv.appendChild(playerName);
			queueHolder.appendChild(playerDiv);
		})

		//Player Statistics
		let numPlayers = document.getElementById('totalPlayers');
		numPlayers.innerText = `Total: ${this.totalPlayers.length}`;
		let inTeams = document.getElementById('inTeams');
		inTeams.innerText = `inTeams: ${this.numInTeams}`;
		let inQueue = document.getElementById('inQueue');
		inQueue.innerText = `inQueue: ${this.queue.length}`;

		//Team Statistics
		let averageSize = document.getElementById('averageSize');
		averageSize.innerText = `Average: ${(this.numInTeams / this.teams.length).toFixed(2)}`;
		let largestSize = document.getElementById('largestSize');
		largestSize.innerText = `Largest: ${this.teams[this.findMaxTeam()].players.length.toFixed(2)}`;
		let smallestSize = document.getElementById('smallestSize');
		smallestSize.innerText = `Smallest: ${this.teams[this.findMinTeam()].players.length.toFixed(2)}`;
	}
}
