// select dom elements
const matchContainerEl = document.querySelector('.all-matches');
const addMatchBtnEl = document.querySelector('.lws-addMatch');
const resetBtnEl = document.querySelector('.lws-reset');




// action constants / identifiers
const INCREMENT = 'score/increment';
const DECREMENT = 'score/decrement';
const RESET = 'score/reset';
const ADD_MATCH = 'match/add';
const DELETE_MATCH = 'match/delete';

// action creators

// action for increment match score
const increment = (payload) => {
    return {
        type: INCREMENT,
        payload,
    };
};

// action for decrement match score
const decrement = (payload) => {
    return {
        type: DECREMENT,
        payload,
    };
};

//action for reset all match scores
const reset = () => {
    return {
        type: RESET,
    };
};

//action for add new match
const addMatch = () => {
    return {type: ADD_MATCH};
}

//action for delete match
const deleteMatch = (matchId) => {
    return {
        type: DELETE_MATCH,
        payload: matchId
    }
}


// initial state
let initialState = [
    {
        id: 1,
        score: 0,
    },
];

// get unique match id
const nextMatchId = (matches) => {
    const maxId = matches.reduce((maxId, match) => Math.max(match.id, maxId), -1);
    return maxId + 1;
}

// create reducer function
function matchReducer (state = initialState, action) {
    // increment score
    if(action.type === INCREMENT) {
        const newMatches = state.map((item) => {
            if (item.id === action.payload.id) {
                return {
                    ...item,
                    score: item.score + Number(action.payload.value),
                };
            }
            return item;
        });
        return newMatches;
    }
    // decrement score
    else if(action.type === DECREMENT) {
        const newMatches = state.map((item) => {
            if (item.id === action.payload.id) {
                const newScore = item.score - Number(action.payload.value);
                return {
                    ...item,
                    score: newScore > 0 ? newScore : 0,
                };
            }
            return item;
        });
        return newMatches;
        
    }
    // reset all match scores
    else if(action.type === RESET) {
        const resetMatches = state.map((item) => ({...item, score: 0}));
        return resetMatches;
    }
    // add new match
    else if(action.type === ADD_MATCH) {
        const matchId = nextMatchId(state);
        return [...state, {id: matchId, score: 0}];
    }
    // delete match
    else if(action.type === DELETE_MATCH) {
        const newMatches = state.filter((match) => match.id !== action.payload);
        return newMatches;
    } else {
        return state;
    }
}



// create store
const store = Redux.createStore(matchReducer);


// handler functions

// increment score handler
const incrementHandler = (id, formEl) => {
    // get increment input field
    const inputEl = formEl.querySelector(".lws-increment");

    // get value from input field
    const value = Number(inputEl.value);

    // dispatch increment action
    if (value > 0) {
        store.dispatch(increment({id, value}));
    }
};

// decrement score handler
const decrementHandler = (id, formEl) => {
    // get decrement input field
    const inputEl = formEl.querySelector(".lws-decrement");

    // get value from input field
    const value = Number(inputEl.value);

    // dispatch decrement action
    if (value > 0) {
        store.dispatch(decrement({id, value}));
    }
};


// delete match handler
const deleteMatchHandler = (matchId) => {
    store.dispatch(deleteMatch(matchId));
}

// add new match on button click event
addMatchBtnEl.addEventListener("click", () => {
    store.dispatch(addMatch());
})

// reset all matches on button click event
resetBtnEl.addEventListener("click", () => {
    store.dispatch(reset());
});



// render function for update UI on each state update
const render = () => {
    const state = store.getState();
    
    const matchView = state.map((item) => {
        return `<div class="match">
        <div class="wrapper">
          <button class="lws-delete" onclick="deleteMatchHandler(${item.id})">
            <img src="./image/delete.svg" alt="" />
          </button>
          <h3 class="lws-matchName">Match ${item.id}</h3>
        </div>
        <div class="inc-dec">
          <form class="incrementForm" onsubmit="event.preventDefault();incrementHandler(${item.id},this)">
            <h4>Increment</h4>
            <input
              type="number"
              name="increment"
              class="lws-increment"
            />
          </form>
          <form class="decrementForm" onsubmit="event.preventDefault();decrementHandler(${item.id},this)">
            <h4>Decrement</h4>
            <input
              type="number"
              name="decrement"
              class="lws-decrement"
            />
          </form>
        </div>
        <div class="numbers">
          <h2 class="lws-singleResult">${item.score}</h2>
        </div>
      </div>`;
    }).join("");

    matchContainerEl.innerHTML = matchView;
};


// render initial view
render();

// subscribe store
store.subscribe(render);
