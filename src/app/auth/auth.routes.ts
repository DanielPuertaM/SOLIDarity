import { Routes } from "@angular/router";

export const authRoutes: Routes = [
	{
		path: '',
		loadComponent: () => import('./auth.component/auth.component')
	},
	{
		path: '**',
		redirectTo: ''
	}
];

export default authRoutes;