import { createStore } from 'redux'
import { INCREASE_GAME_COUNT } from './gameTypes'

const gameState = {
  count: 0,
}

const GameReducer = (state = gameState, action) => {
  switch (action.type) {
    case INCREASE_GAME_COUNT:
      return { count: state.count + 1}
    }

}

const store = createStore(GameReducer)

export default store
