import { prisma } from "@/infra/database/prisma/prisma";
import { app } from "@/infra/http/server";
import { makeCompany } from "@/tests/factories/make-company";
import request from "supertest";

describe("Get Company (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the companies", async () => {
    await prisma.plan.create({
      data: {
        name: 'Name plan',			
        price: '29,90',
        description: 'Description plan',
        interview_limit: 100,
      }
    })
    
    const plan = await prisma.plan.findMany()
    const company = makeCompany({
      planId: plan[0].id,
    })

    const response = await request(app.server)
      .get(`/get-company/${company.id.toString()}`)
      .send();    

    expect(response.status).toEqual(200);
  });
});
