import { prisma } from "@/infra/database/prisma/prisma";
import { app } from "@/infra/http/server";
import request from "supertest";

describe("Fetch Interviewers (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the interviewers", async () => {
    await prisma.plan.create({
      data: {
        name: 'Name plan 1',			
        price: '29,90',
        description: 'Description plan',
        interview_limit: 100,
      }
    })
    
    await prisma.plan.create({
      data: {
        name: 'Name plan 2',			
        price: '39,90',
        description: 'Description plan',
        interview_limit: 100,
      }
    })

    const response = await request(app.server)
      .get("/fetch-interviewers")
      .send();    

    expect(response.status).toEqual(200);
  });
});
