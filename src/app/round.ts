import { FlowerSpecies } from './flowers';
import { TimePeriod } from './time-period';
import * as firebase from 'firebase/app';
import firestore = firebase.firestore;


export type RoundStatus = 'preRound' | 'playRound' | 'postRound';

/**
 * The round data as stored in Firebase.
 */
export interface FirebaseRound {
  flowerSpeciesIds: string[];
  status: RoundStatus;
  running: boolean;
  currentTime: number;
}

/**
 * An individual flower in the round that bees can visit.
 *
 * Instances of RoundFlower are immutable. As such, when a flower
 * blooms or stops blooming, a new instance of RoundFlower is created.
 */
export class RoundFlower {
  readonly isBlooming: boolean;

  constructor(public readonly species: FlowerSpecies, currentTime: TimePeriod) {
    this.isBlooming = currentTime.fallsWithin(...species.blooming_period);
  }

  equals(other: RoundFlower): boolean {
    return this.species === other.species && this.isBlooming === other.isBlooming;
  }
}

export interface RoundStudentData {
  id?: string;
  beeSpecies?: string;
}

export interface Interaction {
  timePeriod: number;
  userId: string;
  barcodeValue: number;
  isNest: boolean;
  incompatibleFlower: boolean;
}

/**
 * A string enum representing the different types of host events we want to record.
 */
export enum HostEventType {
  Pause = 'pause',
  Play = 'play'
}

/*
 * An action performed by the teacher during a round
 * recorded with both time relative to the game and
 * an absolute value according to server's timestamp.
 */
export interface HostEvent {
  eventType: HostEventType;
  timePeriod: number;
  occurredAt: firestore.Timestamp;
}
