import { TargetType } from '../types';

export type reducedValue = number | undefined;

export class DataUtil {
  constructor() {}

  static aggregateData(values: any[][], metric: TargetType) {
    switch (metric) {
      case 'max':
        let reducedMaxValues: reducedValue[] = [];
        for (const value of values) {
          reducedMaxValues.push(DataUtil.getMax(value));
        }
        let finalMaxValue = DataUtil.getInOutDesc(reducedMaxValues);
        return finalMaxValue;
        break;
      case 'min':
        let reducedMinValues: reducedValue[] = [];
        for (const value of values) {
          reducedMinValues.push(DataUtil.getMin(value));
        }
        let finalMinValue = DataUtil.getInOutAsc(reducedMinValues);
        return finalMinValue;
        break;
      case 'mean':
        let reducedMeanValues: reducedValue[] = [];
        for (const value of values) {
          reducedMeanValues.push(DataUtil.getAverage(value));
        }
        let finalMeanValue = DataUtil.getInOutDesc(reducedMeanValues);
        return finalMeanValue;
        break;
      case 'latest':
        let reducedLatestValues: reducedValue[] = [];
        for (const value of values) {
          reducedLatestValues.push(DataUtil.getCurrent(value));
        }
        let finalLatestValue = DataUtil.getInOutDesc(reducedLatestValues);
        return finalLatestValue;
        break;
      default:
        break;
    }
    return [undefined, undefined];
  }

  static getMax(arr: any[]) {
    let max: reducedValue;
    for (const value of arr) {
      if (!max && value) {
        max = value;
      }
      if (max && value && value > max) {
        max = value;
      }
    }
    return max;
  }

  static getMin(arr: any[]) {
    let min: reducedValue;
    for (const value of arr) {
      if (!min && value) {
        min = value;
      }
      if (min && value && value < min) {
        min = value;
      }
    }
    return min;
  }

  static getAverage(arr: any[]) {
    let count = 0;
    let sum = 0;
    for (const value of arr) {
      if (value) {
        sum += value;
        count++;
      }
    }
    let average = sum / count;
    return isNaN(average) ? undefined : average;
  }

  static getCurrent(arr: any[]) {
    let current: reducedValue;
    for (const value of arr) {
      if (value) {
        current = value;
        break;
      }
    }
    return current;
  }

  static getInOutAsc(arr: any) {
    let max = DataUtil.getMax(arr);
    let min = DataUtil.getMin(arr);
    return [min, max];
  }

  static getInOutDesc(arr: any) {
    let max = DataUtil.getMax(arr);
    let min = DataUtil.getMin(arr);
    return [max, min];
  }
}
