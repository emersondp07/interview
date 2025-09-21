import { prisma } from '../prisma/prisma'

export class PrismaMedicationsRepository {
	async findAll() {
		const medications = await prisma.medication.findMany({
			orderBy: {
				created_at: 'desc',
			},
		})

		return medications
	}

	async findById(medicationId: string) {
		const medication = await prisma.medication.findUnique({
			where: {
				id: medicationId,
			},
		})

		return medication
	}

	async findByPrescriptionId(prescriptionId: string) {
		const medications = await prisma.medication.findMany({
			where: {
				prescription_id: prescriptionId,
			},
			orderBy: {
				created_at: 'asc',
			},
		})

		return medications
	}

	async create(data: any) {
		await prisma.medication.create({
			data,
		})
	}

	async update(medicationId: string, data: any) {
		await prisma.medication.update({
			where: {
				id: medicationId,
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(medicationId: string) {
		await prisma.medication.update({
			where: {
				id: medicationId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
