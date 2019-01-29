import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Directory } from '../../../shared/models/directory';
import { DirectoryDbService } from '../../../indexedDb/directory-db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LightingReplacementData } from '../lighting-replacement';
import { LightingReplacementResults } from '../lighting-replacement';

@Injectable()
export class LightingReplacementService {

  baselineData: Array<LightingReplacementData>;
  modificationData: Array<LightingReplacementData>;
  constructor(private directoryDbService: DirectoryDbService, private formBuilder: FormBuilder) { }

  calculate(data: LightingReplacementData): LightingReplacementData {
    data = this.calculateOperatingHours(data);
    data = this.calculateElectricityUse(data);
    data = this.calculateTotalLighting(data);
    return data;
  }

  calculateOperatingHours(data: LightingReplacementData): LightingReplacementData {
    data.hoursPerYear = data.hoursPerDay * data.daysPerMonth * data.monthsPerYear;
    return data;
  }

  calculateElectricityUse(data: LightingReplacementData): LightingReplacementData {
    data.electricityUse = data.wattsPerLamp * data.lampsPerFixture * data.numberOfFixtures * (1 / 1000) * data.hoursPerYear;
    return data;
  }

  calculateTotalLighting(data: LightingReplacementData): LightingReplacementData {
    data.totalLighting = data.lumensPerLamp * data.lampsPerFixture * data.numberOfFixtures;
    return data;
  }

  getTotals(data: Array<LightingReplacementData>): LightingReplacementResults {
    let tmpResults: LightingReplacementResults = {
      totalElectricityUse: _.sumBy(data, 'electricityUse'),
      totalLighting: _.sumBy(data, 'totalLighting'),
      totalOperatingHours: _.sumBy(data, 'hoursPerYear')
    }
    return tmpResults;
  }

  //gets root directory
  getRootDir(): Directory {
    let rootDir: Directory = this.directoryDbService.getById(1);
    return rootDir;
  }
  

  //ignore
  getDirectoryList(allDirectories: Directory): Array<Directory> {
    let directories: Array<Directory> = new Array<Directory>();
    return directories;
  }

  //inits form for saving via file-tree browser
  initForm(): FormGroup {
    let tmpForm: FormGroup = this.formBuilder.group({
      selectedDirectory: [1, Validators.required],
      name: ['', Validators.required]
    });
    return tmpForm;
  }

  getDirectoryArrayFromParentId(id: number): Array<Directory> {
    let parentDir = this.directoryDbService.getById(id);
    if (parentDir === undefined || parentDir === null) {
      return null;
    }
    return parentDir.subDirectory;
  }

  getDirectoryById(id: number): Directory {
    return this.directoryDbService.getById(id);
  }




}