// === IMPLEMENTING combineReducers() FROM SCRATCH ===
// reduce() via the mozilla docs:

// arr.reduce(callback[, initialValue])

// so {} is the initial value (we cannot mutate things in redux), which is why it's
// the second arg in reduce()

const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](
          state[key],
          action
        );
        return nextState;
      },
      {}
    );
  };
};