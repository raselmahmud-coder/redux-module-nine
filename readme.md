# New concept what I have learned

## 1. Redux fundamentals:

### **Redux - Data Flow:**

Redux follows the unidirectional data flow. It means that your application data will follow in one-way binding data flow. As the application grows & becomes complex, it is hard to reproduce issues and add new features if you have no control over the state of your application.

### **What is an action?**

An action is a plain object that describes the intention to cause change with a type property. It must have a type property which tells what type of action is being performed. The command for action is as follows −

```return {
   type: 'ITEMS_REQUEST', //action type
   isLoading: true //payload information
}
```

### **Redux - Store:**
A store is an immutable object tree in Redux. A store is a state container which holds the application’s state. Redux can have only a single store in your application. Whenever a store is created in Redux, you need to specify the reducer.

### **what is dispatch?**
It allows you to delivery an action to change a state in your application.

The syntax for dispatch is as follows −
```
store.dispatch({type:'ITEMS_REQUEST'})
```

### **What is a Subscribe?**
It helps you register a callback that Redux store will call when an action has been dispatched. As soon as the Redux state has been updated, the view will re-render automatically.

The syntax for dispatch is as follows −
```
store.subscribe(()=>{ console.log(store.getState());})
```

### **Redux - Pure Functions**
A function is a process which takes inputs called arguments, and produces some output known as return value. A function is called pure if it abides by the following rules −

* A function returns the same result for same arguments.

* Its evaluation has no side effects, i.e., it does not alter input data.

* No mutation of local & global variables.

* It does not depend on the external state like a global variable.


### **What is a reducer?**

Reducers are a pure function in Redux. Pure functions are predictable. Reducers are the only way to change states in Redux. It is the only place where you can write logic and calculations. Reducer function will accept the previous state of app and action being dispatched, calculate the next state and returns the new object.

The following few things should never be performed inside the reducer −

* Mutation of functions arguments
* API calls & routing logic
* Calling non-pure function e.g. Math.random()

### **Redux - Middleware**
Middleware is a function that takes an action and returns a function. It is a way to extend Redux with custom functionality. It provides a third-party extension point between dispatching an action and the moment it reaches the reducer.

Redux itself is synchronous, so how the async operations like network request work with Redux? Here middlewares come handy. As discussed earlier, reducers are the place where all the execution logic is written. Reducer has nothing to do with who performs it, how much time it is taking or logging the state of the app before and after the action is dispatched.


### **Redux - Devtools**

Redux-Devtools provide us debugging platform for Redux apps. It allows us to perform time-travel debugging and live editing. Some of the features in official documentation are as follows −

* It lets you inspect every state and action payload.

* It lets you go back in time by “cancelling” actions.

* If you change the reducer code, each “staged” action will be re-evaluated.

* If the reducers throw, we can identify the error and also during which action this happened.

* With persistState() store enhancer, you can persist debug sessions across page reloads.


## 2. React Redux:
React Redux is the official UI bindings for react Application. It is kept up-to-date with any API changes to ensure that your React components behave as expected. It encourages good 'React' architecture. It implements many performance optimizations internally, which allows to components re-render only when it actually needs.

There have four type API reference in React Redux following of them:

* Provider
* connect()
* Hooks
* batch()



## 3. Redux toolkit:

### **Store setup**

A friendly abstraction over the standard Redux createStore function that adds good defaults to the store setup for a better development experience.
There have several API for store setup:

* configureStore
* getDefaultMiddleware
* Immutability Middleware
* Serializability Middleware
* createListenerMiddleware

### **Reducers and Actions**

A utility that simplifies creating Redux reducer functions. It uses Immer internally to drastically simplify immutable update logic by writing "mutative" code in your reducers, and supports directly mapping specific action types to case reducer functions that will update the state when that action is dispatched.

There have several API for reducers and actions:

* createReducer
* createAction
* createSlice
* createAsyncThunk

### **Queries**
A query operation can be performed with any data fetching library of your choice, but the general recommendation is that you only use queries for requests that retrieve data.

### **Mutations**
Mutations are used to send data updates to the server and apply the changes to the local cache. Mutations can also invalidate cached data and force re-fetches.

### **Manual Cache Updates**
For most cases, in order to receive up to date data after a triggering a change in the backend, you can take advantage of cache tag invalidation to perform automated re-fetching, which will cause a query to re-fetch its data when it has been told that a mutation has occurred which would cause its data to become out of date. 





## This project file structure:


📦src </br>
 ┣ 📂app</br>
 ┃ ┗ 📜store.js</br>
 ┣ 📂assets</br>
 ┃ ┗ 📂images</br>
 ┃ ┃ ┣ 📜blank.svg</br>
 ┃ ┃ ┣ 📜logo.svg</br>
 ┃ ┃ ┣ 📜lws-logo-dark.svg</br>
 ┃ ┃ ┗ 📜lws-logo-light.svg</br>
 ┣ 📂components</br>
 ┃ ┣ 📂inbox</br>
 ┃ ┃ ┣ 📂chatbody</br>
 ┃ ┃ ┃ ┣ 📜Blank.js</br>
 ┃ ┃ ┃ ┣ 📜ChatBody.js</br>
 ┃ ┃ ┃ ┣ 📜ChatHead.js</br>
 ┃ ┃ ┃ ┣ 📜Message.js</br>
 ┃ ┃ ┃ ┣ 📜Messages.js</br>
 ┃ ┃ ┃ ┗ 📜Options.js</br>
 ┃ ┃ ┣ 📜Blank.js</br>
 ┃ ┃ ┣ 📜ChatIItems.js</br>
 ┃ ┃ ┣ 📜ChatItem.js</br>
 ┃ ┃ ┣ 📜Modal.js</br>
 ┃ ┃ ┣ 📜Navigation.js</br>
 ┃ ┃ ┗ 📜Sidebar.js</br>
 ┃ ┣ 📂ui</br>
 ┃ ┃ ┣ 📜Error.js</br>
 ┃ ┃ ┗ 📜isValidEmail.js</br>
 ┃ ┣ 📜PrivateRoute.js</br>
 ┃ ┗ 📜PublicRoute.js</br>
 ┣ 📂features</br>
 ┃ ┣ 📂API</br>
 ┃ ┃ ┗ 📜APISlice.js</br>
 ┃ ┣ 📂auth</br>
 ┃ ┃ ┣ 📜authAPI.js</br>
 ┃ ┃ ┗ 📜authSlice.js</br>
 ┃ ┣ 📂conversations</br>
 ┃ ┃ ┣ 📜conversationsApi.js</br>
 ┃ ┃ ┗ 📜conversationsSlice.js</br>
 ┃ ┣ 📂messages</br>
 ┃ ┃ ┣ 📜messagesApi.js</br>
 ┃ ┃ ┗ 📜messagesSlice.js</br>
 ┃ ┗ 📂users</br>
 ┃ ┃ ┗ 📜usersAPI.js</br>
 ┣ 📂hooks</br>
 ┃ ┣ 📜useAuth.js</br>
 ┃ ┗ 📜useAuthVerification.js</br>
 ┣ 📂pages</br>
 ┃ ┣ 📜Conversation.js</br>
 ┃ ┣ 📜Inbox.js</br>
 ┃ ┣ 📜Login.js</br>
 ┃ ┗ 📜Register.js</br>
 ┣ 📂utils</br>
 ┃ ┗ 📜getPartnersInfo.js</br>
 ┗ 📜App.js</br>