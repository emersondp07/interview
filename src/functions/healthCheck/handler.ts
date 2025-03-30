import type { APIGatewayProxyResult } from 'aws-lambda'

export async function healthCheck(): Promise<APIGatewayProxyResult> {
	return {
		statusCode: 200,
		headers: {
			'content-type': 'application/json',
			'Access-Control-Allow-Origin': '*',
		},
		body: JSON.stringify({ message: 'ok, the gateway appears to be healthy' }),
	}
}
