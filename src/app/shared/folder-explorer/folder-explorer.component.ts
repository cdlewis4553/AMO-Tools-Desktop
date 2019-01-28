import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, SimpleChanges } from '@angular/core';
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
  @Input()
  selectedDirectoryId: number;
  // @Output('emitSelectedDirectory')
  // emitSelectedDirectory = new EventEmitter<DirectoryTreeItem>();
  // @Output('emitDeselectDirectory')
  // emitDeselectDirectory = new EventEmitter<boolean>();
  @Output('emitUpdateDirectoryId')
  emitUpdateDirectoryId = new EventEmitter<number>();

  subList: Array<DirectoryTreeItem>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {  
    console.log(this.root.directory.id);
    this.createDirectoryTreeList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.root && !changes.root.firstChange) {
      console.log('changes to root');
    }
    if (changes.selectedDirectoryId && !changes.selectedDirectoryId.firstChange) {
      console.log('changes to selected dir id');
      console.log('root = ' + this.root.directory.name);
      // this.deselectDirectories();
      // this.emitUpdateDirectoryId.emit(this.selectedDirectoryId);
    }
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

  // selectDir(directoryTreeItem: DirectoryTreeItem) {
  //   directoryTreeItem = {
  //     directory: directoryTreeItem.directory,
  //     expanded: directoryTreeItem.expanded,
  //     selected: true
  //   }
  //   if (this.root.directory !== directoryTreeItem.directory) {
  //     console.log('DIFFERENT');
  //     // this.root.selected = false;
  //     this.root = {
  //       directory: this.root.directory,
  //       expanded: this.root.expanded,
  //       selected: false
  //     };
  //     for (let i = 0; i < this.subList.length; i++) {
  //       if (this.subList[i].directory !== directoryTreeItem.directory) {
  //         this.subList[i] = {
  //           directory: this.subList[i].directory,
  //           expanded: this.subList[i].expanded,
  //           selected: false
  //         };
  //       }
  //     }
  //   }
  //   else {
  //     console.log('SAME');
  //     this.root = {
  //       directory: this.root.directory,
  //       expanded: this.root.expanded,
  //       selected: true
  //     };
  //     for (let i = 0; i < this.subList.length; i++) {
  //       this.subList[i] = {
  //         directory: this.subList[i].directory,
  //         expanded: this.subList[i].expanded,
  //         selected: false
  //       };
  //     }
  //   }
  //   console.log('selectedDirectoryTreeItem = ');
  //   console.log(directoryTreeItem);
  //   this.emitSelectedDirectory.emit(directoryTreeItem);
  // }

  selectDir(directoryTreeItem: DirectoryTreeItem) {
    this.root = {
      directory: directoryTreeItem.directory,
      expanded: directoryTreeItem.expanded,
      selected: true
    }
    this.selectedDirectoryId = this.root.directory.id;
    // for (let i = 0; i < this.subList.length; i++) {
    //   this.subList[i] = {
    //     directory: this.subList[i].directory,
    //     expanded: this.subList[i].expanded,
    //     selected: false
    //   };
    // }

    this.emitUpdateDirectoryId.emit(this.selectedDirectoryId);
  }

  updateSelectedId(id: number) {
    this.selectedDirectoryId = id;
    this.deselectDirectories();
  }

  deselectDirectories() {
    if (this.root.directory.id !== this.selectedDirectoryId) {
      this.root = {
        directory: this.root.directory,
        expanded: this.root.expanded,
        selected: false
      };
    }
    this.emitUpdateDirectoryId.emit(this.selectedDirectoryId);

    // for (let i = 0; i < this.subList.length; i++) {
    //   if (this.subList[i].directory.id !== this.selectedDirectoryId) {
    //     this.subList[i] = {
    //       directory: this.subList[i].directory,
    //       expanded: this.subList[i].expanded,
    //       selected: false
    //     };
    //   }
    // }
  }

}
