import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/infra/http/server'
import { makeCompany } from '@/tests/factories/make-company'
import { makePlan } from '@/tests/factories/make-plan'
import request from 'supertest'
import { makeSignature } from '../../../../tests/factories/make-signature'

describe('Create Invoice (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create invoice', async () => {
    const plan = makePlan()

    await prisma.plan.create({
      data: {
        id: plan.id.toString(),
        name: plan.name,			
        price:  plan.price,
        description: plan.description,
        interview_limit: plan.interviewLimit,
      }
    })

    const company = makeCompany()

    await prisma.company.create({
      data: {
        id: company.id.toString(),
        corporate_reason: company.corporateReason,
        cnpj: company.cnpj,
        email: company.email,
        password: company.password,
        phone: company.phone,
        plan_id: plan.id.toString(),
        role: company.role,
      }
    })

    const signature = makeSignature()

    await prisma.signature.create({
      data: {
        id: signature.id.toString(),
        company_id: company.id.toString(),
        plan_id: plan.id.toString(),
        status: 'ACTIVE'
      }
    })

    const response = await request(app.server).post('/create-invoice').send({
      mounth: 'JAN',
      value: '29,90',
      status: 'OPEN',
      signatureId: signature.id.toString(),
    })

    expect(response.status).toEqual(201)
  })
})
