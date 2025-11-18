import { Routes } from "@angular/router";
import { roleRedirectGuard } from "@auth/guards/role-guard";
import { roleWildcardGuard } from "@auth/guards/roleWildCard-guard";

export const userRoutes: Routes = [
	{
		path: '',
		canActivate: [roleRedirectGuard],
		children: []
	},
	{
		path: 'dashboard-donante',
		loadComponent: () => import('@shared/components/dashboard-global/dashboard'),
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},

			{
				path: 'home',
				loadComponent: () => import('../shared/components/campania-list/campania-list')
			},
			{
				path: 'campania',
				loadComponent: () => import('./dashboard-donante/create-campania/create-campania')
			},
			{
				path: 'home/campania/:id',
				loadComponent: () => import('./dashboard-donante/campania-perfil/campania-perfil')
			},
			{
				path: 'home/mycampania/:id',
				loadComponent: () => import('./dashboard-donante/edit-campania/edit-campania')
			},
			{
				path: 'home/campania/:id/donacion',
				loadComponent: () => import('./dashboard-donante/donacion/donacion')
			},
			{
				path: 'perfil',
				loadComponent: () => import('../shared/components/user-profile/user-profile')
			},
			{
				path: 'about',
				loadComponent: () => import('../shared/components/landing-page/landing-page')
			},
			{
				path: '**',
				redirectTo: 'home'
			}




		]
	}, {
		path: 'dashboard-admin',
		loadComponent: () => import('@shared/components/dashboard-global/dashboard'),
		children: [
			{
				path: 'home',
				loadComponent: () => import('../shared/components/campania-list/campania-list')
			},
			{
				path: 'users',
				loadComponent: () => import('./dashboard-admin/users/users')
			},
		]
	},{
		path: 'dashboard-verificador',
		loadComponent: () => import('@shared/components/dashboard-global/dashboard'),
		children: [
			{
				path: 'home',
				loadComponent: () => import('../shared/components/campania-list/campania-list')
			},
			{
				path: 'users/pdfs',
				loadComponent: () => import('./dashboard-admin/users/users')
			},
			{
				path: 'perfil',
				loadComponent: () => import('../shared/components/user-profile/user-profile')
			},
		]
	},

	

]

export default userRoutes;