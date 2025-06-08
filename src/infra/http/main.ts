import { env } from '../config'
import { io, start } from './server'

io.on('connection', (socket) => {
	console.log('Socket conectado:', socket.id)

	socket.on('hello', (msg) => {
		console.log('Mensagem hello recebida:', msg)
		socket.emit('helloBack', { response: 'Olá do servidor!' })
	})

	socket.on('disconnect', () => console.log('Socket desconectado:', socket.id))
})

start()
	.then(() => console.log(`🚀 Server + Socket.IO Running on port ${env.PORT}`))
	.catch((err) => {
		console.error('Erro ao iniciar o servidor:', err)
		process.exit(1)
	})
