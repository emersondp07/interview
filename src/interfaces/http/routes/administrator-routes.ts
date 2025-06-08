import { authenticateAdministratorSchema } from '@/domain/administrator/application/validators/authenticate-administrator.schema'
import { createAdministratorSchema } from '@/domain/administrator/application/validators/create-administrator.schema'
import { fetchCompaniesSchema } from '@/domain/administrator/application/validators/fetch-companies.schema'
import { fetchPlansSchema } from '@/domain/administrator/application/validators/fetch-plans.schema'
import { getCompanySchema } from '@/domain/administrator/application/validators/get-company.schema'
import { registerCompanySchema } from '@/domain/administrator/application/validators/register-company.schema'
import { createPlanSchema } from '../../../domain/administrator/application/validators/create-plan.schema'
import { ROLE } from '../../../domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { authenticateAdministrator } from '../controllers/administrator/authenticate-administrator'
import { createAdministrator } from '../controllers/administrator/create-administrator'
import { createPlan } from '../controllers/administrator/create-plan'
import { fetchCompanies } from '../controllers/administrator/fetch-companies'
import { fetchPlans } from '../controllers/administrator/fetch-plans'
import { getCompany } from '../controllers/administrator/get-company'
import { refresh } from '../controllers/administrator/refresh'
import { registerCompany } from '../controllers/administrator/register-company'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function administratorRoutes(app: FastifyTypedInstance) {
	app.post(
		'/session-administrator',
		{
			schema: {
				tags: ['Administrator'],
				summary: '',
				description: '',
				body: authenticateAdministratorSchema,
			},
		},
		authenticateAdministrator,
	)

	app.patch('/token/refresh', refresh)

	app.post(
		'/create-administrator',
		{
			schema: {
				tags: ['Administrator'],
				summary: '',
				description: '',
				body: createAdministratorSchema,
			},
		},
		createAdministrator,
	)

	app.post(
		'/register-company',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Register a new company',
				description:
					'This route allows an administrator to register a new company.',
				body: registerCompanySchema,
			},
		},
		registerCompany,
	)

	app.get(
		'/fetch-plans',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Fetch all plans',
				description:
					'This route allows an administrator to fetch all available plans.',
				querystring: fetchPlansSchema,
			},
		},
		fetchPlans,
	)

	app.post(
		'/create-plan',
		{
			schema: {
				tags: ['Administrator'],
				summary: '',
				description: '',
				body: createPlanSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.ADMIN)],
		},
		createPlan,
	)

	app.get(
		'/fetch-companies',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Fetch all companies',
				description:
					'This route allows an administrator to fetch all registered companies.',
				querystring: fetchCompaniesSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.ADMIN)],
		},
		fetchCompanies,
	)

	app.get(
		'/get-company/:companyId',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Get company by ID',
				description:
					'This route allows an administrator to get a company by its ID.',
				params: getCompanySchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.ADMIN)],
		},
		getCompany,
	)
}
