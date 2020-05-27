import { Pipe, PipeTransform } from '@angular/core';
import { empty, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProfileService } from 'src/app/services/profile.service';

@Pipe({
    name: 'userprofile'
})
export class UserProfilePipe implements PipeTransform {

    constructor(private userProfileSvc: ProfileService) { }

    transform(id: string): Observable<any> {
        
        if (!!id) {
            return this.userProfileSvc.getUserProfileById(id.toString()).pipe(take(1));
        } else {
            return empty();
        }
        
    }

}
