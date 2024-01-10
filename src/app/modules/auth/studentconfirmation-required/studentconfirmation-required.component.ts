import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-studentconfirmation-required',
  templateUrl: './studentconfirmation-required.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthStudentconfirmationRequiredComponent {


  public message: string = '';
  /**
   * Constructor
   */
  constructor(private router: Router)
  {
      const currentNavigation = this.router.getCurrentNavigation();
      if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
          const customData = currentNavigation.extras.state;
          this.message = customData?.message;
      } else {
          this.router.navigateByUrl('/');
      }
  }
}

