import { userReducer } from "./user-reducer";

test("reducer should increment only age", () => {
  const startState = { age: 20, childrenCount: 3, name: "Vova" };

  const endSate = userReducer(startState, { type: "INCREMENT-AGE" });

  expect(endSate.age).toBe(21);
  expect(endSate.childrenCount).toBe(3);
  expect(startState).not.toBe(endSate);
});

test("reducer should increment only childrenCount ", () => {
  const startState = { age: 20, childrenCount: 3, name: "Vova" };

  const endState = userReducer(startState, {
    type: "INCREMENT-CHILDREN-COUNT",
  });

  expect(endState.childrenCount).toBe(4);
  expect(endState.age).toBe(20);
  expect(startState).not.toBe(endState);
});

test("reducer should change user name", () => {
  const startState = { age: 20, childrenCount: 3, name: "Vova" };

  const endState = userReducer(startState, {
    type: "CHANGE-USER-NAME",
    name: "Kirill",
  });

  expect(endState.name).toBe("Kirill");
  expect(endState.age).toBe(20);
  expect(endState.childrenCount).toBe(3);
  expect(endState).not.toBe(startState);
});
