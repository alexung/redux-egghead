// below is not the whole app, just createStore written from scratch
// understanding how createStore works from scratch below:
const createStore = (reducer) => {
  let state;

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    // below is basically an unsubscribe method within the greater subscribe method
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const store = createStore(counter);