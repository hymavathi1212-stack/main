import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalHttpInterceptor } from './global-http-interceptor.service';
import { GlobalHttpErrorInterceptor } from './global-http-error-interceptor.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from "ng-recaptcha";
import { environment } from 'environments/environment';
import { AuthStudentsignUpComponent } from './modules/auth/studentsign-up/studentsign-up.component';



const routerConfig: ExtraOptions = {
    useHash: true,
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        
      
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        RecaptchaV3Module
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalHttpInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: GlobalHttpErrorInterceptor,
            multi: true
        },
        {   provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.siteKey
        }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
