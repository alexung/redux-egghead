// === Avoiding array mutuations with concat(), slice(), and ...spread ===

// NOTES:
// .slice vs .splice
// .slice returns copy
// .splice edits actual array (CANNOT MUTATE ARRAYS IN REDUX)

// Also, deepFreeze protects you from mutation in your tests. good to use in testing

// END NOTES

const addCounter = (list) => {
  // list.push(0);
  // return list;
  // instead of above syntax, whic will cause a mutation of the list and error out,
  // we can use spread operator or the syntax commented below
  // return list.concat([0]);
  return [...list, 0];
};

const removeCounter = () => {
  // CAN'T USE SPLICE (BC IT'S A MUTATING METHOD) in redux!
  // list.splice(index, 1);
  // return list;

  // return list
  //         .slice(0, index)
  //         .concat(list.slice(index + 1));

  // or can use ES6 spread operator

  // IMPORTANT!!
  // this return is concatenating the parts before the index
  // you want to skip and after the index you want to skip
  // to get a new array!
  return [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ];
};

const IncrementCounter = (list, index) => {
  return [
    ...list.slice(0, index),
    list[index] + 1,
    ...list.slice(index + 1)
  ];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];

  deepFreeze(listBefore);

  expect(
    addCounter(listBefore)
  ).toEqual(listAfter);
};

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  expect(
    removeCounter(listBefore, 1)
  ).toEqual(listAfter);
};

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);
  // when deepFreezing things, we cannot mutate the array. this is how
  // redux works

  expect(
    incrementCounter(listBefore, 1)
  ).toEqual(listAfter);
};

testAddCounter();
testRemoveCounter();
// you can add this console log to see if things passed
// bc js will run from top to bottom and freeze if there
// are errors.  so if there's an error, this message will
// not show
console.log('All tests passed.')