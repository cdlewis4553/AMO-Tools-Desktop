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
  @Output('emitUpdateDirectoryId')
  emitUpdateDirectoryId = new EventEmitter<number>();

  subList: Array<DirectoryTreeItem>;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.createDirectoryTreeList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.root && !changes.root.firstChange) {
    }
    if (changes.selectedDirectoryId && !changes.selectedDirectoryId.firstChange) {
      this.updateSelectedId(changes.selectedDirectoryId.currentValue);
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


  selectDir(directoryTreeItem: DirectoryTreeItem) {
    if (this.root.directory.id === directoryTreeItem.directory.id) {
      this.root = {
        directory: directoryTreeItem.directory,
        expanded: directoryTreeItem.expanded,
        selected: true
      }
      this.selectedDirectoryId = this.root.directory.id;
    }
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
  }
}
