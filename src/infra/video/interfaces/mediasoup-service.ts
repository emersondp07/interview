import type * as mediasoup from 'mediasoup'

export interface IMediaSoupService {
	initialize(): Promise<void>
	getRtpCapabilities(): mediasoup.types.RtpCapabilities
	createWebRtcTransport(): Promise<mediasoup.types.WebRtcTransport>
	canConsume(
		producerId: string,
		rtpCapabilities: mediasoup.types.RtpCapabilities,
	): boolean
}
