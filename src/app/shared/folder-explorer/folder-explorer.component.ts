import { Component, OnInit, Input } from '@angular/core';
import { DirectoryTreeItem } from '../models/directory';

@Component({
  selector: 'app-folder-explorer',
  templateUrl: './folder-explorer.component.html',
  styleUrls: ['./folder-explorer.component.css']
})
export class FolderExplorerComponent implements OnInit {
  @Input()
  root: DirectoryTreeItem;
  @Input()
  padding: number;


  subList: Array<DirectoryTreeItem>;

  constructor() { }

  ngOnInit() {
    this.createDirectoryTreeList();

  }

  createDirectoryTreeList() {
    this.subList = new Array<DirectoryTreeItem>();
    if (this.root.directory.subDirectory !== undefined && this.root.directory.subDirectory !== null) {
      for (let i = 0; i < this.root.directory.subDirectory.length; i++) {
        let dirItem = {
          directory: this.root.directory.subDirectory[i],
          expanded: false
        }
        this.subList.push(dirItem);
      }
    }
  }

  getPaddingString() {
    return "0px 0px 0px " + this.padding + "px";
  }

  getSubPaddingString() {
    return "0px 0px 0px " + (this.padding + 10) + "px";
  }

  expandDir(directoryTreeItem: DirectoryTreeItem, i: number) {
    this.subList[i] = {
      directory: directoryTreeItem.directory,
      expanded: true
    }
  }

}
