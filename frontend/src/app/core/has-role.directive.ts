import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
  selector: '[hasRole]',
  standalone: true
})
export class HasRoleDirective {
  private tpl = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private auth = inject(AuthService);

  private roles: string[] = [];
  private hasView = false;

  @Input('hasRole') set setRoles(value: string[] | string) {
    this.roles = Array.isArray(value) ? value : [value];
    this.update();
  }

  constructor() {
    this.auth.currentUser$.subscribe(() => this.update());
  }

  private update() {
    const user = this.auth.currentUserValue;
    const allowed = !!user && this.roles.includes(user.role);
    if (allowed && !this.hasView) {
      this.vcr.createEmbeddedView(this.tpl);
      this.hasView = true;
    } else if (!allowed && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
