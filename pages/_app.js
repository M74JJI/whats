import '../styles/globals.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Login from './login';
import Loading from '../components/Loading';
import firebase from 'firebase';
import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from '../reducers';
const persistConfig = {
    key: 'root',
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, composeWithDevTools());
const persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
    const [user, loading] = useAuthState(auth);
    useEffect(() => {
        if (user) {
            db.collection('users').doc(user.uid).set(
                {
                    email: user.email,
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                    photoURL: user.photoURL,
                },
                { merge: true }
            );
        }
    }, [user]);

    if (loading) return <Loading />;
    if (!user) {
        return <Login />;
    }
    return (
        <>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        </>
    );
}

export default MyApp;
