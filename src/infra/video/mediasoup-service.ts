import * as mediasoup from 'mediasoup'
import type { IMediaSoupService } from './interfaces/mediasoup-service'

export class MediaSoupService implements IMediaSoupService {
	private static instance: MediaSoupService
	private worker?: mediasoup.types.Worker
	private router?: mediasoup.types.Router

	private constructor() {}

	static getInstance(): MediaSoupService {
		if (!MediaSoupService.instance) {
			MediaSoupService.instance = new MediaSoupService()
		}
		return MediaSoupService.instance
	}

	async initialize(): Promise<void> {
		if (!this.worker) {
			this.worker = await this.createWorker()
		}

		if (!this.router) {
			this.router = await this.createRouter()
		}
	}

	private async createWorker(): Promise<mediasoup.types.Worker> {
		const worker = await mediasoup.createWorker({
			logLevel: 'warn',
			logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
			rtcMinPort: 10000,
			rtcMaxPort: 10100,
		})

		worker.on('died', (error) => {
			console.error('Mediasoup worker morreu:', error)

			if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
				setTimeout(() => process.exit(1), 2000)
			} else {
				console.warn(
					'MediaSoup worker died in test environment - not exiting process',
				)
				this.worker = undefined
				this.router = undefined
			}
		})

		return worker
	}

	private async createRouter(): Promise<mediasoup.types.Router> {
		if (!this.worker) {
			throw new Error('Worker not initialized')
		}

		return await this.worker.createRouter({
			mediaCodecs: [
				{
					kind: 'audio',
					mimeType: 'audio/opus',
					clockRate: 48000,
					channels: 2,
				},
				{
					kind: 'video',
					mimeType: 'video/VP8',
					clockRate: 90000,
					parameters: {
						'x-google-start-bitrate': 1000,
					},
				},
				{
					kind: 'video',
					mimeType: 'video/H264',
					clockRate: 90000,
					parameters: {
						'packetization-mode': 1,
						'profile-level-id': '42e01f',
						'level-asymmetry-allowed': 1,
					},
				},
			],
		})
	}

	getRouter(): mediasoup.types.Router {
		if (!this.router) {
			throw new Error('Router not initialized')
		}
		return this.router
	}

	getRtpCapabilities(): mediasoup.types.RtpCapabilities {
		return this.getRouter().rtpCapabilities
	}

	async createWebRtcTransport(): Promise<mediasoup.types.WebRtcTransport> {
		const transport = await this.getRouter().createWebRtcTransport({
			listenIps: [
				{
					ip: '0.0.0.0',
					announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
				},
			],
			enableUdp: true,
			enableTcp: true,
			preferUdp: true,
			initialAvailableOutgoingBitrate: 1000000,
			appData: {},
		})

		transport.on('dtlsstatechange', (dtlsState) => {
			if (dtlsState === 'closed') {
				console.log('Transport DTLS closed')
				transport.close()
			}
		})

		transport.on('@close', () => {
			console.log('Transport fechado')
		})

		return transport
	}

	canConsume(
		producerId: string,
		rtpCapabilities: mediasoup.types.RtpCapabilities,
	): boolean {
		return this.getRouter().canConsume({ producerId, rtpCapabilities })
	}

	async cleanup(): Promise<void> {
		if (this.worker && !this.worker.closed) {
			this.worker.close()
		}
		this.worker = undefined
		this.router = undefined
	}

	static resetInstance(): void {
		MediaSoupService.instance = undefined as any
	}
}
