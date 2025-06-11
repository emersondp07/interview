import { env } from '@/infra/config'
import jwt from 'jsonwebtoken'
import type { ExtendedError, Socket } from 'socket.io'

export function verifyJwtSocket(
	socket: Socket,
	next: (err?: ExtendedError) => void,
) {
	const authHeader = socket.handshake.auth?.token

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return next(new Error('Token não informado ou inválido'))
	}

	const token = authHeader.replace('Bearer ', '')

	try {
		const payload = jwt.verify(token, env.JWT_SECRET)
		socket.data.user = payload
		next()
	} catch (err) {
		return next(new Error('Token inválido ou expirado'))
	}
}
