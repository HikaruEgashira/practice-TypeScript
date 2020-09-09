import * as T from "fp-ts/lib/Task";
import { sequenceT } from "fp-ts/Apply";

const sleep = (msec: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, msec));

export async function main() {
  const tasks = sequenceT(T.task)(T.of("a"), T.of("b"));
  return await tasks();
}
