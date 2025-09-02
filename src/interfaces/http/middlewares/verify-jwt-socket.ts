import { env } from '@/infra/config'
import jwt from 'jsonwebtoken'
import type { ExtendedError, Socket } from 'socket.io'

export function verifyJwtSocket(
	socket: Socket,
	next: (err?: ExtendedError) => void,
) {
	const token = socket.handshake.headers.cookie
		?.split('; ')
		.find((cookie) => cookie.startsWith('token='))
		?.replace('token=', '')

	if (!token) {
		return next(new Error('Token não informado ou inválido'))
	}

	try {
		const payload = jwt.verify(token, env.JWT_SECRET)
		socket.data.user = payload
		next()
	} catch (err) {
		return next(new Error('Token inválido ou expirado'))
	}
}
