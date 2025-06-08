import { cancelInvoiceParams } from '@/domain/company/application/validators/cancel-invoice.schema'
import { createContractSchema } from '@/domain/company/application/validators/create-contract.schema'
import { createInterviewerSchema } from '@/domain/company/application/validators/create-interviewer.schema'
import { createInvoiceSchema } from '@/domain/company/application/validators/create-invoice.schema'
import { deleteClientParams } from '@/domain/company/application/validators/delete-client.schema'
import { deleteInterviewerParams } from '@/domain/company/application/validators/delete-interviewer.schema'
import { fetchInterviewersSchema } from '@/domain/company/application/validators/fetch-interviewers.schema'
import { fetchInvoicesSchema } from '@/domain/company/application/validators/fetch-invoices.schema'
import { registerClientSchema } from '@/domain/company/application/validators/register-client.schema'
import { ROLE } from '../../../domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { authenticateCompanySchema } from '../../../domain/company/application/validators/authenticate-client.schema'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { authenticateCompany } from '../controllers/company/authenticate-company'
import { cancelInvoice } from '../controllers/company/cancel-invoice'
import { createContract } from '../controllers/company/create-contract'
import { createInterviewer } from '../controllers/company/create-interviewer'
import { createInvoice } from '../controllers/company/create-invoice'
import { deleteClient } from '../controllers/company/delete-client'
import { deleteInterviewer } from '../controllers/company/delete-interviewer'
import { fetchInterviewers } from '../controllers/company/fetch-interviewers'
import { fetchInvoices } from '../controllers/company/fetch-invoices'
import { registerClient } from '../controllers/company/register-client'
import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export async function companyRoutes(app: FastifyTypedInstance) {
	app.post(
		'/session-company',
		{
			schema: {
				tags: ['Company'],
				summary: '',
				description: '',
				body: authenticateCompanySchema,
			},
		},
		authenticateCompany,
	)

	app.get(
		'/fetch-interviewers',
		{
			schema: {
				tags: ['Company'],
				summary: 'Fetch all interviewers',
				description:
					'This route allows a company to fetch all registered interviewers.',
				querystring: fetchInterviewersSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		fetchInterviewers,
	)

	app.get(
		'/fetch-invoices',
		{
			schema: {
				tags: ['Company'],
				summary: 'Fetch all invoices',
				description: 'This route allows a company to fetch all invoices.',
				querystring: fetchInvoicesSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		fetchInvoices,
	)

	app.post(
		'/register-client',
		{
			schema: {
				tags: ['Company'],
				summary: 'Register a new client',
				description: 'This route allows a company to register a new client.',
				body: registerClientSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		registerClient,
	)

	app.post(
		'/create-invoice',
		{
			schema: {
				tags: ['Company'],
				summary: 'Create a new invoice',
				description: 'This route allows a company to create a new invoice.',
				body: createInvoiceSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		createInvoice,
	)

	app.post(
		'/create-contract',
		{
			schema: {
				tags: ['Company'],
				summary: 'Create a new contract',
				description: 'This route allows a company to create a new contract.',
				body: createContractSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		createContract,
	)

	app.post(
		'/create-interviewer',
		{
			schema: {
				tags: ['Company'],
				summary: 'Create a new interviewer',
				description: 'This route allows a company to create a new interviewer.',
				body: createInterviewerSchema,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		createInterviewer,
	)

	app.delete(
		'/cancel-invoice/:invoiceId/:signatureId',
		{
			schema: {
				tags: ['Company'],
				summary: 'Cancel an invoice',
				description: 'This route allows a company to cancel an invoice.',
				params: cancelInvoiceParams,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		cancelInvoice,
	)

	app.delete(
		'/delete-client/:clientId',
		{
			schema: {
				tags: ['Company'],
				summary: 'Delete a client',
				description:
					'This route allows a company to delete a registered client.',
				params: deleteClientParams,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		deleteClient,
	)

	app.delete(
		'/delete-interviewer/:companyId/:interviewerId',
		{
			schema: {
				tags: ['Company'],
				summary: 'Delete an interviewer',
				description:
					'This route allows a company to delete a registered interviewer.',
				params: deleteInterviewerParams,
			},
			onRequest: [verifyJWT, verifyUserRole(ROLE.COMPANY)],
		},
		deleteInterviewer,
	)
}
