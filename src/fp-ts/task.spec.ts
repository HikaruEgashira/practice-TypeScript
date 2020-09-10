import { promiseAllExample, taskExample } from "./task";

const input = [4, 2, 3];
const expectOutput = [400, 200, 300];
describe("task vs promise", () => {
  it("seqence task", async () => {
    const res = await taskExample(input);
    expect(res).toEqual(expectOutput);
  });

  it("seqence promise", async () => {
    const res = await promiseAllExample(input);
    expect(res).toEqual(expectOutput);
  });
});
