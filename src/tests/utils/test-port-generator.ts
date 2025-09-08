// Utility para gerar portas únicas para testes paralelos
// Para evitar conflitos EADDRINUSE entre testes

const usedPorts = new Set<number>()
const basePort = 4000 // Base port diferente do padrão (3001)

export function getUniqueTestPort(): number {
	let port = basePort + Math.floor(Math.random() * 1000)
	
	// Garante que não reutilize a mesma porta
	while (usedPorts.has(port)) {
		port = basePort + Math.floor(Math.random() * 1000)
	}
	
	usedPorts.add(port)
	return port
}

export function releaseTestPort(port: number): void {
	usedPorts.delete(port)
}