import { Route } from '@angular/router';
import { AuthStudentsignUpComponent } from 'app/modules/auth/studentsign-up/studentsign-up.component';

export const authstudentSignupRoutes: Route[] = [
    {
        path     : '',
        component: AuthStudentsignUpComponent
    }
];