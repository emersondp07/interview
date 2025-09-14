import type * as mediasoup from 'mediasoup'

export interface InterviewRoomProps {
	interviewId: string
	doctorId: string
	patientId: string
	doctorSocketId?: string
	patientSocketId?: string
	producers: Map<string, mediasoup.types.Producer[]>
	consumers: Map<string, mediasoup.types.Consumer[]>
	producerTransports: Map<string, mediasoup.types.WebRtcTransport>
	consumerTransports: Map<string, mediasoup.types.WebRtcTransport>
	isRecording: boolean
	ffmpegProcess?: any
	recordingStartTime?: Date
	recordingPath?: string
}

export class InterviewRoom {
	public readonly props: InterviewRoomProps

	constructor(props: InterviewRoomProps) {
		this.props = props
	}

	static create(
		interviewId: string,
		patientId: string,
		doctorId: string,
	): InterviewRoom {
		return new InterviewRoom({
			interviewId,
			doctorId,
			patientId,
			producers: new Map(),
			consumers: new Map(),
			producerTransports: new Map(),
			consumerTransports: new Map(),
			isRecording: false,
		})
	}

	get interviewId(): string {
		return this.props.interviewId
	}

	get doctorId(): string {
		return this.props.doctorId
	}

	get patientId(): string {
		return this.props.patientId
	}

	get doctorSocketId(): string | undefined {
		return this.props.doctorSocketId
	}

	get patientSocketId(): string | undefined {
		return this.props.patientSocketId
	}

	get isRecording(): boolean {
		return this.props.isRecording
	}

	get recordingStartTime(): Date | undefined {
		return this.props.recordingStartTime
	}

	get recordingPath(): string | undefined {
		return this.props.recordingPath
	}

	setDoctorSocket(socketId: string): void {
		this.props.doctorSocketId = socketId
	}

	setPatientSocket(socketId: string): void {
		this.props.patientSocketId = socketId
	}

	clearDoctorSocket(): void {
		this.props.doctorSocketId = undefined
	}

	clearPatientSocket(): void {
		this.props.patientSocketId = undefined
	}

	startRecording(recordingPath: string): void {
		this.props.isRecording = true
		this.props.recordingStartTime = new Date()
		this.props.recordingPath = recordingPath
	}

	stopRecording(): {
		duration: number
		startTime?: Date
		endTime: Date
		path?: string
	} {
		const duration = this.props.recordingStartTime
			? Date.now() - this.props.recordingStartTime.getTime()
			: 0

		this.props.isRecording = false

		return {
			path: this.props.recordingPath,
			duration: Math.round(duration / 1000),
			startTime: this.props.recordingStartTime,
			endTime: new Date(),
		}
	}

	getProducers(socketId: string): mediasoup.types.Producer[] {
		return this.props.producers.get(socketId) || []
	}

	addProducer(socketId: string, producer: mediasoup.types.Producer): void {
		const producers = this.props.producers.get(socketId) || []
		producers.push(producer)
		this.props.producers.set(socketId, producers)
	}

	removeProducer(socketId: string, producerId: string): void {
		const producers = this.props.producers.get(socketId) || []
		const updatedProducers = producers.filter((p) => p.id !== producerId)
		this.props.producers.set(socketId, updatedProducers)
	}

	getConsumers(socketId: string): mediasoup.types.Consumer[] {
		return this.props.consumers.get(socketId) || []
	}

	addConsumer(socketId: string, consumer: mediasoup.types.Consumer): void {
		const consumers = this.props.consumers.get(socketId) || []
		consumers.push(consumer)
		this.props.consumers.set(socketId, consumers)
	}

	removeConsumer(socketId: string, consumerId: string): void {
		const consumers = this.props.consumers.get(socketId) || []
		const updatedConsumers = consumers.filter((c) => c.id !== consumerId)
		this.props.consumers.set(socketId, updatedConsumers)
	}

	setProducerTransport(
		socketId: string,
		transport: mediasoup.types.WebRtcTransport,
	): void {
		this.props.producerTransports.set(socketId, transport)
	}

	getProducerTransport(
		socketId: string,
	): mediasoup.types.WebRtcTransport | undefined {
		return this.props.producerTransports.get(socketId)
	}

	setConsumerTransport(
		socketId: string,
		transport: mediasoup.types.WebRtcTransport,
	): void {
		this.props.consumerTransports.set(socketId, transport)
	}

	getConsumerTransport(
		socketId: string,
	): mediasoup.types.WebRtcTransport | undefined {
		return this.props.consumerTransports.get(socketId)
	}

	clearSocket(socketId: string): void {
		const producers = this.getProducers(socketId)
		producers.forEach((producer) => producer.close())

		const consumers = this.getConsumers(socketId)
		consumers.forEach((consumer) => consumer.close())

		const producerTransport = this.getProducerTransport(socketId)
		if (producerTransport) {
			producerTransport.close()
		}

		const consumerTransport = this.getConsumerTransport(socketId)
		if (consumerTransport) {
			consumerTransport.close()
		}

		this.props.producers.delete(socketId)
		this.props.consumers.delete(socketId)
		this.props.producerTransports.delete(socketId)
		this.props.consumerTransports.delete(socketId)

		if (this.props.doctorSocketId === socketId) {
			this.props.doctorSocketId = undefined
		}
		if (this.props.patientSocketId === socketId) {
			this.props.patientSocketId = undefined
		}
	}

	getParticipantCount(): number {
		return (
			(this.props.doctorSocketId ? 1 : 0) + (this.props.patientSocketId ? 1 : 0)
		)
	}

	getOtherSocketId(currentSocketId: string): string | undefined {
		return currentSocketId === this.props.doctorSocketId
			? this.props.patientSocketId
			: this.props.doctorSocketId
	}

	hasNoParticipants(): boolean {
		return !this.props.doctorSocketId && !this.props.patientSocketId
	}
}
