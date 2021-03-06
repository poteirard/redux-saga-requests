import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import axios from 'axios';
import { createRequestInstance, watchRequests } from 'redux-saga-requests';

import { photoReducer, postReducer } from './reducers';

function* rootSaga(axiosInstance) {
  yield createRequestInstance(axiosInstance);
  yield watchRequests();
}

export const configureStore = () => {
  const reducers = combineReducers({
    photo: photoReducer,
    post: postReducer,
  });

  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  const store = createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
    ),
  );

  const axiosInstance = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' });
  sagaMiddleware.run(rootSaga, axiosInstance);
  return store;
};
