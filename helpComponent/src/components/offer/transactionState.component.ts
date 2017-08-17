import { Component, Input } from '@angular/core';
import { OfferTransactionState, TransactionStateInterface } from '../interfaces/offer.interface';

@Component({
    selector: 'transactionState',
    template:
    `
    <div *ngIf="transactionState" class="ui medium form">
        <div class="two fields">

            <div class="field four wide input" [ngClass]="{'error': OfferTransactionState.failed == transactionState.state}">
                <label>Transaction state</label>
                <input id="transactionStateTxt" type="text" [disabled]="true" [value]="transactionState.state">
            </div>

            <div *ngIf="transactionState.description" class="field four wide input" [ngClass]="{'error': OfferTransactionState.failed == transactionState.state}">
                <label>Description</label>
                <input id="transactionDescriptionTxt" type="text" [disabled]="true" [value]="transactionState.description">
            </div>
            
        </div>
    </div>
    `
})

export class TransactionState {
    @Input() transactionState: TransactionStateInterface;
    OfferTransactionState = OfferTransactionState;
}