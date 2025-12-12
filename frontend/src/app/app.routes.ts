import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ShellComponent } from './features/shell/shell.component';
import { EventsListComponent } from './features/events/events-list.component';
import { EventDetailComponent } from './features/events/event-detail.component';
import { EventCreateComponent } from './features/events/event-create.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { CertificatesComponent } from './features/certificates/certificates.component';
import { MembersListComponent } from './features/members/members-list.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{
		path: '', component: ShellComponent, canActivate: [authGuard], children: [
			{ path: 'events', component: EventsListComponent },
			{ path: 'events/create', component: EventCreateComponent },
			{ path: 'events/:id', component: EventDetailComponent },
			{ path: 'attendance/:id', component: AttendanceComponent, canActivate: [authGuard] },
			{ path: 'certificates/:id', component: CertificatesComponent, canActivate: [authGuard] },
			{ path: 'members', component: MembersListComponent, canActivate: [authGuard] },
			{ path: '', pathMatch: 'full', redirectTo: 'events' }
		]
	}
];
