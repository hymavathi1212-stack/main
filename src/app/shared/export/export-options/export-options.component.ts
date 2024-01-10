import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalApiService } from 'app/global-api.service';

@Component({
  selector: 'app-export-options',
  templateUrl: './export-options.component.html',
  styleUrls: ['./export-options.component.scss']
})
export class ExportOptionsComponent implements OnInit {
  @ViewChild('dialogContent') dialogContent: ElementRef;
  @ViewChild('exportOptionsNgForm') exportOptionsNgForm: NgForm;
  columnsModel: any = {};
  columns: any = [];
  reqProcessing: boolean = false;
  constructor(
    public _dialogRef: MatDialogRef<ExportOptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _globalApiService: GlobalApiService,
    private _snackBar: MatSnackBar,
  ) {
  }
  ngOnInit(): void {
    this.columns = this.data?.columns;
  }

  saveCommission() {
    if (this.exportOptionsNgForm.form.status === 'VALID') {
      this.reqProcessing = true;
      const commission = [];
      for (let eachItem in this.columnsModel) {
        commission.push({
          id: parseInt(eachItem),
          commissionRate: parseFloat(this.columnsModel[eachItem])
        });
      }
      const params = {
        apiName: 'update_profile_type_wise_commission',
        body: {
          productId: this.data.selectedProduct?.id,
          commission: commission
        }
      }
      this._globalApiService.post(params).subscribe(data => {
        this._snackBar.open(data?.message, `Okay`, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000
        });
        this.reqProcessing = false;
        this._dialogRef.close({
          refresh: true
        });
      }, err => {
        this._snackBar.open(err?.error?.error || 'Unable to process your request', `Okay`, {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000
        });
        this.reqProcessing = false;
      });
    }
  }
  onToggleChange() {
    
  }
}
