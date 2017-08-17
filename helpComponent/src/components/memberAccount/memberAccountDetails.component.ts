import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MemberInterface } from '../interfaces/member.interface';
import { MemberServices } from '../../services/member.services';
import { NavParams, NavController } from 'ionic-angular';
import { PageService } from '../pageHeader/page.service';

@Component({
    selector: 'memberAccountCreat',
    templateUrl: 'memberAccountDetails.component.html',
})
export class MemberAccountDetailsPage implements OnInit {
    pageTitle: string;

    member: MemberInterface;

    message: string = null;
    form: FormGroup;

    address: string;
    balance: string;

    constructor(private formBuilder: FormBuilder, private memberServices: MemberServices, navParams: NavParams, private navController: NavController, private pageService: PageService) {
        this.balance = navParams.get("balance");
        this.member = this.pageService.getMember();
        this.address = this.member['account'];

        this.pageTitle = this.member.fullName + " - Account Details";
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'address': new FormControl({ value: '', disabled: true }),
            'balance': new FormControl({ value: '', disabled: true }),
        })
    }

    close() {
        this.navController.popToRoot();
    }
}