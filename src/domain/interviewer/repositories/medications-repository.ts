import type { Medication } from '../entities/medication'

export interface MedicationsRepository {
	findAll(): Promise<Medication[] | null>
	findById(medicationId: string): Promise<Medication | null>
	findByPrescriptionId(prescriptionId: string): Promise<Medication[] | null>
	create(medication: Medication): Promise<void>
	update(medication: Medication): Promise<void>
	delete(medication: Medication): Promise<void>
}
