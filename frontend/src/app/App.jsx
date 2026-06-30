// import {useState} from 'react'
import {Provider } from "react-redux"
import {store} from "../app/store.jsx"

function App() {

    return (
            <Provider store={store}>
                <div className="App">
                    <h1>Watsapp Clone</h1>
                </div>
            </Provider>
    );
}

export default App;