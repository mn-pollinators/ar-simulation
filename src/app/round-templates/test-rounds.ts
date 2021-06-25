import { allBeeSpecies, allBeeSpeciesArray } from '../bees';
import { allFlowerSpecies, allFlowerSpeciesArray } from '../flowers';
import { TimePeriod } from '../time-period';
import { RoundTemplateSet } from './round-templates';

export const testRounds: RoundTemplateSet = {
  id: 'test-rounds',
  name: 'Test Rounds',
  templates: [
    {
      id: 'test-long-round',
      name: 'Long Round',
      flowerSpecies: [
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale
      ],
      startTime: TimePeriod.fromMonthAndQuarter(4, 1),
      endTime: TimePeriod.fromMonthAndQuarter(11, 4),
      tickSpeed: 99999,
      bees: [
        allBeeSpecies.bombus_affinis,
        allBeeSpecies.apis_mellifera
      ]
    },
    {
      id: 'test-fast-round',
      name: 'Fast Round',
      flowerSpecies: [
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale,
        allFlowerSpecies.taraxacum_officinale
      ],
      startTime: TimePeriod.fromMonthAndQuarter(5, 1),
      endTime: TimePeriod.fromMonthAndQuarter(7, 4),
      tickSpeed: 1000,
      bees: [
        allBeeSpecies.bombus_affinis,
        allBeeSpecies.apis_mellifera
      ]
    },
    {
      id: 'test-crazy-round',
      name: 'Crazy Round',
      flowerSpecies: [
        ...allFlowerSpeciesArray.slice(0, 16)
      ],
      startTime: TimePeriod.fromMonthAndQuarter(5, 1),
      endTime: TimePeriod.fromMonthAndQuarter(7, 4),
      tickSpeed: 1000,
      bees: [
        ...allBeeSpeciesArray
      ]
    },
  ],
};
