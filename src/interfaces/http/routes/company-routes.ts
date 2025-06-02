import { cancelInvoiceParams } from '@/domain/company/application/validators/cancel-invoice.schema'
import { createContractSchema } from '@/domain/company/application/validators/create-contract.schema'
import { createInterviewerSchema } from '@/domain/company/application/validators/create-interviewer.schema'
import { createInvoiceSchema } from '@/domain/company/application/validators/create-invoice.schema'
import { deleteClientParams } from '@/domain/company/application/validators/delete-client.schema'
import { deleteInterviewerParams } from '@/domain/company/application/validators/delete-interviewer.schema'
import { fetchInterviewersSchema } from '@/domain/company/application/validators/fetch-interviewers.schema'
import { fetchInvoicesSchema } from '@/domain/company/application/validators/fetch-invoices.schema'
import { registerClientSchema } from '@/domain/company/application/validators/register-client.schema'
import type { FastifyTypedInstance } from '../../@types/instances.type'
import { cancelInvoice } from '../controllers/company/cancel-invoice'
import { createContract } from '../controllers/company/create-contract'
import { createInterviewer } from '../controllers/company/create-interviewer'
import { createInvoice } from '../controllers/company/create-invoice'
import { deleteClient } from '../controllers/company/delete-client'
import { deleteInterviewer } from '../controllers/company/delete-interviewer'
import { fetchInterviewers } from '../controllers/company/fetch-interviewers'
import { fetchInvoices } from '../controllers/company/fetch-invoices'
import { registerClient } from '../controllers/company/register-client'

export async function companyRoutes(app: FastifyTypedInstance) {
	// app.addHook('onRequest', verifyJWT)
	// app.addHook('onRequest', verifyUserRole(ROLE.COMPANY))

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
		},
		deleteInterviewer,
	)
}
