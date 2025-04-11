import { Either, failed, success } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return success(1);
  } else {
    return failed("error");
  }
}

test("success result", () => {
  const sut = doSomething(true);

  expect(sut.isSuccess()).toBe(true);
  expect(sut.isFailed()).toBe(false);
});

test("error result", () => {
  const sut = doSomething(false);

  expect(sut.isFailed()).toBe(true);
  expect(sut.isSuccess()).toBe(false);
});
