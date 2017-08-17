import { Injectable } from "@angular/core";
import { CacheService } from "ionic-cache";
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { PageService } from '../pageHeader/page.service';
import { Constants } from '../../utils/constans';

@Injectable()
export class LoanTypeCacheUtils {
    username: string;
    constructor(private cache: CacheService, private pageService: PageService) {
        this.username = this.pageService.getStudent().email;
    }

    getCacheKey() {
        return Constants.ELIGIBLE_LOANS_CACHE + '_' + this.username;
    }

    public remove(loanTypeToRemove: LoanTypeInterface): void {
        if (loanTypeToRemove == null) {
            return;
        }

        // Get from cache all eligible loans
        this.cache.getItem(this.getCacheKey()).catch(() => {
            // fall here if item is expired or doesn't exist
            return;
        }).then((data: LoanTypeInterface[]) => {
            if (data) {
                // Filter data and remove entry by loanCode
                data = data.filter((value: LoanTypeInterface, index: number, array: LoanTypeInterface[]) => {
                    return value.info.loanCode != loanTypeToRemove.info.loanCode;
                });

                this.cache.saveItem(this.getCacheKey(), data);
            }
        });
    }


    public update(loanTypeToUpdate: LoanTypeInterface): void {
        if (loanTypeToUpdate == null) {
            return;
        }

        // Get from cache all eligible loans
        this.cache.getItem(this.getCacheKey()).catch(() => {
            // fall here if item is expired or doesn't exist
            return;
        }).then((data: LoanTypeInterface[]) => {
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].info.loanCode == loanTypeToUpdate.info.loanCode && data[i].info.govId == loanTypeToUpdate.info.govId) {
                        data[i] = loanTypeToUpdate;
                        this.cache.saveItem(this.getCacheKey(), data);
                        break;
                    }
                }
            }
        });
    }
}
