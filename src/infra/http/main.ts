import { env } from '../config'
import { start } from './server'

start()
	.then(() => console.log(`🚀 Server + Socket.IO Running on port ${env.PORT}`))
	.catch((err) => {
		console.error('Error starting server:', err)
		process.exit(1)
	})
