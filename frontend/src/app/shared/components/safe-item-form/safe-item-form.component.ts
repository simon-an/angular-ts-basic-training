import { Component, EventEmitter, OnInit, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { SafeItem } from 'src/app/core';

interface State {
  model: SafeItem;
}

@Component({
  selector: 'cool-safe-item-form',
  templateUrl: './safe-item-form.component.html',
  styleUrls: ['./safe-item-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafeItemFormComponent implements OnInit {
  @Output()
  result: EventEmitter<SafeItem> = new EventEmitter();
  store = createStore(myReducer);

  constructor() {
       this.store.subscribe((state: State) => { 
           console.log("STATE CHANGED", state)
       });

  }

  ngOnInit() {}

  onSubmit() {
    this.result.emit({ ...this.store.getState().model });
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify({ ...this.store.getState() });
  }

  OnNameChanged(e){
    this.store.dispatch({type:'nameChanged', payload: { name: e }})
  }

   OnPriceChanged(e){
    this.store.dispatch({type:'priceChanged', payload: { price: e }})
  }
}

function myReducer(state, action) {
  switch(action.type){
    case 'nameChanged':
    {
      return {...state, model: { ...state.model, name: action.payload.name }};
    }
     case 'priceChanged':
    {
      return {...state, model: { ...state.model, price: action.payload.price }};
    }
    default: 
     return state;
  }
  console.log(state, action);
  return state;
};

function createStore(reducer) {
    var state: State = { model: {} as SafeItem };
    var listeners = []

    function getState() {
        return state
    }
    
    function subscribe(listener) {
        listeners.push(listener)
        return function unsubscribe() {
            var index = listeners.indexOf(listener)
            listeners.splice(index, 1)
        }
    }
    
    function dispatch(action) {
        state = reducer(state, action)
        listeners.forEach(listener => listener(state))
    }

    dispatch({})

    return { dispatch, subscribe, getState }
}
