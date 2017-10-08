import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Card } from '../../models/card';
import { DeleteDialogComponent } from "../dialogs/delete-dialog.component";
import {MdDialog} from "@angular/material";
import {List} from "../../models/list";
import {RetrospectiveService} from "../../providers/retrospective.service";
import {Subscription} from "rxjs/Subscription";
import {DragulaService} from "ng2-dragula";
import {CreateCardDialogComponent} from "../dialogs/createCard-dialog.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() list: List;
  @Input() cards: Card[];
  @Input() state: number;
  public editing: boolean = false;

  constructor(public deleteDialog: MdDialog,
              private retrospectiveService: RetrospectiveService) {}

  createCard() {
    let dialogRef = this.deleteDialog.open(CreateCardDialogComponent, {
      data: this.list
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== 0) {
        let newCard = {
          id: 6,
          listId: this.list.id,
          description: result.feedback,
          votes: 0
        };

        console.log(1);
        this.retrospectiveService.addCard(newCard);
      }
    });
  }

  editList(status: boolean) {
    this.editing = status;
  }

  saveList(newTitle: string) {
    this.list.title = newTitle;

    this.editing = false;
  }

  deleteList() {
    let dialogRef = this.deleteDialog.open(DeleteDialogComponent, {
      data: { message: 'Tem certeza que deseja remover essa lista?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.retrospectiveService.deleteList(this.list);
      }
    });
  }

  ngOnDestroy() {
    console.log('destroy list');
  }
}
