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

### **What is a reducer?**



### 2. React Redux:


### 1. Redux toolkit:
