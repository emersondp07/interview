// import path from 'node:path'
// import { Worker } from 'node:worker_threads'

// function createWorker(file: string, name: string) {
// 	const worker = new Worker(path.resolve(__dirname, file), {
// 		execArgv: ['-r', 'tsx'],
// 	})

// 	worker.on('online', () => console.log(`[${name}] iniciado`))
// 	worker.on('message', (msg) => console.log(`[${name}] =>`, msg))
// 	worker.on('error', (err) => console.error(`[${name}] erro:`, err))
// 	worker.on('exit', (code) => console.log(`[${name}] saiu com código ${code}`))

// 	return worker
// }

// // sobe workers
// const serverWorker = createWorker('main.ts', 'SERVER')
// // const webrtcWorker = createWorker('webrtc.ts', 'WEBRTC')

// setTimeout(() => {
// 	serverWorker.postMessage({ type: 'START_STREAM', roomId: '123' })
// }, 2000)
