import * as T from "fp-ts/Task";
import * as A from "fp-ts/Array";

const sleep = async (msec: number) => {
  await new Promise((resolve) => setTimeout(resolve, msec));
  console.log(msec);
  return msec;
};

const sleepTask = (msec: number): T.Task<number> => async () => {
  return await sleep(msec);
};

/**
 * [3, 2, 1] => [300, 200, 100]
 */
export async function taskExample(arr: Array<number>) {
  const sleepTasks = arr.map((num) => sleepTask(100 * num));
  const sleepSeqTasks = A.array.sequence(T.taskSeq)(sleepTasks);

  const numbers = await sleepSeqTasks();
  return numbers;
}

/**
 * [3, 2, 1] => [300, 200, 100]
 */
export async function promiseAllExample(arr: Array<number>) {
  const promiseNumbers = arr.map(async (num) => await sleep(100 * num));

  const numbers = await Promise.all(promiseNumbers);
  return numbers;
}
