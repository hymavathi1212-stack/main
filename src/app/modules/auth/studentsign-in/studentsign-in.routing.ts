import { Route } from '@angular/router';
import { AuthStudentsignInComponent } from 'app/modules/auth/studentsign-in/studentsign-in.component';

export const authstudentSigninRoutes: Route[] = [
    {
        path     : '/sign-in',
        component: AuthStudentsignInComponent
    }
];