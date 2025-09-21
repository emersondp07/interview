import { z } from 'zod'

export const calculateRiskScoreParams = z.object({
	clientId: z.string().uuid(),
})

export const calculateRiskScoreSchema = z.object({
	vitalSigns: z.object({
		systolicBP: z.number().min(70).max(250),
		diastolicBP: z.number().min(40).max(150),
		heartRate: z.number().min(30).max(220),
		temperature: z.number().min(32).max(45),
		respiratoryRate: z.number().min(8).max(60),
		oxygenSaturation: z.number().min(70).max(100),
	}),
	riskFactors: z.object({
		age: z.number().min(0).max(150),
		hasChronicConditions: z.boolean(),
		smokingStatus: z.enum(['never', 'former', 'current']),
		bmi: z.number().min(10).max(100).optional(),
		medicationCount: z.number().min(0),
		symptomSeverity: z.number().min(1).max(10),
	}),
})

export type CalculateRiskScoreParams = z.infer<typeof calculateRiskScoreParams>
export type CalculateRiskScoreSchema = z.infer<typeof calculateRiskScoreSchema>