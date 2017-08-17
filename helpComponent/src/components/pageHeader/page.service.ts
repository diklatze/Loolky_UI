import { Injectable } from '@angular/core';
import { PageFooter } from './pageFooter.component';
import { StudentInterface } from '../interfaces/student.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { ToolBarMenuInterface } from './pageHeader.component.android';


@Injectable()
export class PageService {
    private static pageFooter: PageFooter = null;

    private static username: string = null;
    private static usertype: string = null;
    private static member: MemberInterface = null;
    private static student: StudentInterface = null;
    private static landingPage: any;

    private static headerMenu: ToolBarMenuInterface = null;

    public set headerMenu(headerMenu: ToolBarMenuInterface) {
        PageService.headerMenu = headerMenu;
    }

    public get headerMenu(): ToolBarMenuInterface {
        return PageService.headerMenu;
    }

    public set pageFooter(pageFooter: PageFooter) {
        PageService.pageFooter = pageFooter;
    }

    public get pageFooter(): PageFooter {
        return PageService.pageFooter;
    }

    public getUsername(): string {
        return PageService.username;
    }

    public setUsername(username: string) {
        PageService.username = username;
    }

    public getMember(): MemberInterface {
        return PageService.member;
    }

    public setMember(member: MemberInterface) {
        PageService.member = member;
    }

    public getStudent(): StudentInterface {
        return PageService.student;
    }

    public setStudent(student: StudentInterface) {
        PageService.student = student;
    }

    public getUsertype(): string {
        return PageService.usertype;
    }

    public setUsertype(usertype: string) {
        PageService.usertype = usertype;
    }


    public getLandingPage(): any {
        return PageService.landingPage;
    }

    public setLandingPage(landingPage: any) {
        PageService.landingPage = landingPage;
    }
}