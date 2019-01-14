import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
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
  @Input()
  inceptionLevel: number;
  @Output('emitSelectedDirectory')
  emitSelectedDirectory = new EventEmitter<DirectoryTreeItem>();


  subList: Array<DirectoryTreeItem>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.createDirectoryTreeList();

  }

  createDirectoryTreeList() {
    this.subList = new Array<DirectoryTreeItem>();
    if (this.root.directory.subDirectory !== undefined && this.root.directory.subDirectory !== null) {
      for (let i = 0; i < this.root.directory.subDirectory.length; i++) {
        let dirItem = {
          directory: this.root.directory.subDirectory[i],
          expanded: false,
          selected: false
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


  expandDir(directoryTreeItem: DirectoryTreeItem) {
    //collapse if already expanded
    if (this.root.expanded) {
      this.root = {
        directory: this.root.directory,
        expanded: false,
        selected: this.root.selected
      }
    }
    else {
      this.root = {
        directory: this.root.directory,
        expanded: true,
        selected: this.root.selected
      }
    }

  }

  // expandDir(directoryTreeItem: DirectoryTreeItem, i: number) {    
  //   //collapse if already expanded
  //   if (this.subList[i].expanded) {
  //     this.subList[i] = {
  //       directory: directoryTreeItem.directory,
  //       expanded: false,
  //       selected: this.subList[i].selected
  //     };
  //   }
  //   //expand if collapsed when clicked
  //   else {
  //     this.subList[i] = {
  //       directory: directoryTreeItem.directory,
  //       expanded: true,
  //       selected: this.subList[i].selected
  //     }
  //   }
  // }

  selectDir(directoryTreeItem: DirectoryTreeItem) {
    directoryTreeItem = {
      directory: directoryTreeItem.directory,
      expanded: directoryTreeItem.expanded,
      selected: true
    }
    if (this.root.directory !== directoryTreeItem.directory) {
      this.root.selected = false;
    }
    else {
      this.root.selected = true;
    }
    console.log('selectedDirectoryTreeItem = ');
    console.log(directoryTreeItem);
    this.emitSelectedDirectory.emit(directoryTreeItem);
  }

}
