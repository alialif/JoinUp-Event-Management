import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// Import CGI components as needed
// Example imports (adjust based on actual library structure):
// import { CgiNavContainerModule } from '../../../cgi-components/package/lib/cgi-nav-container/cgi-nav-container.module';
// import { CgiTopNavModule } from '../../../cgi-components/package/lib/cgi-top-nav/cgi-top-nav.module';
// import { CgiAlertContainerModule } from '../../../cgi-components/package/lib/cgi-alert-container/cgi-alert-container.module';
// import { CgiToasterModule } from '../../../cgi-components/package/lib/cgi-toaster/cgi-toaster.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    // Add CGI component modules here when integrating
    // CgiNavContainerModule,
    // CgiTopNavModule,
    // CgiAlertContainerModule,
    // CgiToasterModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
    // Re-export CGI modules for use in feature modules
    // CgiNavContainerModule,
    // CgiTopNavModule,
    // CgiAlertContainerModule,
    // CgiToasterModule,
  ]
})
export class SharedModule { }
