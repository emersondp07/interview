import { createPlanSchema } from '@/domain/administrator/application/validators/create-plan.schema'
import { fetchCompaniesSchema } from '@/domain/administrator/application/validators/fetch-companies.schema'
import { fetchPlansSchema } from '@/domain/administrator/application/validators/fetch-plans.schema'
import { getCompanySchema } from '@/domain/administrator/application/validators/get-company.schema'
import { registerCompanySchema } from '@/domain/administrator/application/validators/register-company.schema'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { createPlan } from '../controllers/administrator/create-plan'
import { fetchCompanies } from '../controllers/administrator/fetch-companies'
import { fetchPlans } from '../controllers/administrator/fetch-plans'
import { getComapany } from '../controllers/administrator/get-company'
import { registerCompany } from '../controllers/administrator/register-company'

export async function administratorRoutes(app: FastifyTypedInstance) {
	// app.addHook('onRequest', verifyJWT)
	// app.addHook('onRequest', verifyUserRole(ROLE.ADMIN))

	app.post(
		'/create-plan',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Create a new plan',
				description: 'This route allows an administrator to create a new plan.',
				body: createPlanSchema,
			},
		},
		createPlan,
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
		'/fetch-companies',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Fetch all companies',
				description:
					'This route allows an administrator to fetch all registered companies.',
				querystring: fetchCompaniesSchema,
			},
		},
		fetchCompanies,
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

	app.get(
		'/get-company',
		{
			schema: {
				tags: ['Administrator'],
				summary: 'Get company by ID',
				description:
					'This route allows an administrator to get a company by its ID.',
				params: getCompanySchema,
			},
		},
		getComapany,
	)
}
