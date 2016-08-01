//=== Adding react in to make this more scalable rather than just having JQuery update the DOM ===

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

// create a react component for Counter
const Counter = ({
  value,
  onIncrement,
  onDecrement
  }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);
// the onClick methods above are referenced in the actual componet ReactDOM def
// below.  There are store.dispatches there!


const { createStore } = Redux;
const store = createStore(counter);

// The value of these react components is calculated on the fly,
// based on redux's getState function!
// It's calling Counter, which we defined above
// We do need a root div on the html page, however
const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() =>
        // these are callbacks that pass store.dispatch
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={() =>
        // these are callbacks that pass store.dispatch
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
    document.getElementById('root')
  )

};

store.subscribe(render);
render();

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});