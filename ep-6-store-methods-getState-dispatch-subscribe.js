const counter = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

const { createStore } = Redux;
// ABOVE IS SAME AS:
// var createStore = Redux.createStore;
// or
// import { createStore } from 'redux'

const store = createStore(counter);
// console.log(store.getState());
// console log above would log 0 because that's the initial state

const render = () => {
  document.body.innerText = store.getState();
};

store.subscribe(render);
// have to call render a first time to get initial state, as below:
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});