import { Route } from '@angular/router';
import { AuthStudentconfirmationRequiredComponent } from 'app/modules/auth/studentconfirmation-required/studentconfirmation-required.component';

export const authstudentConfirmationRequiredRoutes: Route[] = [
    {
        path     : '',
        component: AuthStudentconfirmationRequiredComponent
    }
];