import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
	// 1. Informações Gerais
	{
		question: 'Você possui plano de saúde?',
		options: ['Sim', 'Não'],
	},
	{
		question: 'Já realizou alguma consulta médica nos últimos 12 meses?',
		options: ['Sim', 'Não'],
	},
	{
		question: 'Já foi hospitalizado ou passou por cirurgia?',
		options: ['Sim', 'Não'],
	},

	// 2. Condições Crônicas
	{
		question: 'Você possui alguma das seguintes condições?',
		options: [
			'Diabetes',
			'Hipertensão arterial',
			'Asma/Doença pulmonar crônica',
			'Doença cardíaca',
			'Nenhuma',
		],
	},

	// 3. Uso de Medicamentos
	{
		question: 'Está em uso contínuo de algum medicamento?',
		options: ['Sim', 'Não'],
	},
	{
		question: 'Faz uso de medicamentos sem prescrição médica com frequência?',
		options: ['Sim', 'Não'],
	},

	// 4. Histórico Familiar
	{
		question: 'Na sua família existe histórico de:',
		options: [
			'Hipertensão',
			'Diabetes',
			'Câncer',
			'Doenças cardíacas',
			'Nenhuma',
		],
	},

	// 5. Hábitos de Vida
	{
		question: 'Você fuma atualmente?',
		options: ['Nunca', 'Ex-fumante', 'Sim'],
	},
	{
		question: 'Consome bebidas alcoólicas?',
		options: ['Nunca', 'Socialmente', 'Frequentemente'],
	},
	{
		question: 'Pratica atividade física?',
		options: ['Não', '1–2x por semana', '3+ vezes por semana'],
	},
	{
		question: 'Qual é a sua qualidade de sono?',
		options: ['Boa', 'Regular', 'Ruim'],
	},

	// 6. Saúde Mental
	{
		question:
			'Nos últimos 14 dias, você se sentiu triste, deprimido ou sem esperança?',
		options: ['Nunca', 'Algumas vezes', 'Frequentemente'],
	},
	{
		question: 'Tem dificuldades para se concentrar em atividades do dia a dia?',
		options: ['Nunca', 'Algumas vezes', 'Frequentemente'],
	},
	{
		question: 'Já recebeu diagnóstico de ansiedade ou depressão?',
		options: ['Sim', 'Não'],
	},

	// 7. Situação Atual (Pré-Consulta)
	{
		question: 'Você apresenta algum sintoma hoje?',
		options: [
			'Febre',
			'Tosse',
			'Dor no peito',
			'Falta de ar',
			'Dor de cabeça',
			'Nenhum',
		],
	},

	// 8. Contatos de Emergência
	{
		question: 'Você possui contato de emergência atualizado?',
		options: ['Sim', 'Não'],
	},
]

async function main() {
	console.log('Starting seed...')

	// Criar perguntas de entrevista
	for (const question of questions) {
		await prisma.interviewQuestion.create({
			data: {
				question: question.question,
				options: question.options,
				required: true,
			},
		})
	}

	console.log(`✅ Seeded ${questions.length} interview questions`)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
