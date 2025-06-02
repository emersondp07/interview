export class AuthenticateUseCase {
	// async execute({
	// 	email,
	// 	password,
	// }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
	// 	const user = await this.usersRepository.findByEmail(email)
	// 	if (!user) {
	// 		throw new InvalidCredencialsError()
	// 	}
	// 	const doesPasswordMatches = await compare(password, user.password_hash)
	// 	if (!doesPasswordMatches) {
	// 		throw new InvalidCredencialsError()
	// 	}
	// 	return { user }
	// }
}
