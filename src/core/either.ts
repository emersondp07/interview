export class Failed<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isSuccess(): this is Success<L, R> {
    return false;
  }

  isFailed(): this is Failed<L, R> {
    return true;
  }
}

export class Success<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isSuccess(): this is Success<L, R> {
    return true;
  }

  isFailed(): this is Failed<L, R> {
    return false;
  }
}

export type Either<L, R> = Failed<L, R> | Success<L, R>;

export const failed = <L, R>(value: L): Either<L, R> => {
  return new Failed(value);
};

export const success = <L, R>(value: R): Either<L, R> => {
  return new Success(value);
};
