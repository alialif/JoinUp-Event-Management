import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from '../../shared/spinner.component';
import { ToastContainerComponent } from '../../shared/toast-container.component';
import { HasRoleDirective } from '../../core/has-role.directive';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, SpinnerComponent, ToastContainerComponent, HasRoleDirective],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  private auth = inject(AuthService);
  router = inject(Router);
  private translate = inject(TranslateService);

  currentUser$ = this.auth.currentUser$;
  languages = ['en','fr-CA'];
  lang = signal(this.translate.currentLang || this.translate.getDefaultLang());

  switchLang(l: string) {
    this.translate.use(l);
    localStorage.setItem('lang', l);
    this.lang.set(l);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
