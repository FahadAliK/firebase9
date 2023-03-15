import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	collection,
	// getDocs,
	addDoc,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	where,
	orderBy,
	serverTimestamp,
	getDoc,
	updateDoc,
} from 'firebase/firestore';

import {
	getAuth,
	createUserWithEmailAndPassword,
	signOut,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAIA6AqWyEwGUU59Cxi6Urg_Jp4-rpQSeQ',
	authDomain: 'fir-9-getting-started-c84f8.firebaseapp.com',
	projectId: 'fir-9-getting-started-c84f8',
	storageBucket: 'fir-9-getting-started-c84f8.appspot.com',
	messagingSenderId: '687899276825',
	appId: '1:687899276825:web:e5a4e2c1b1cfcb30729c88',
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, 'books');

// queries
const queryRef = query(
	colRef,
	// where('author', '==', 'fahad'),
	orderBy('createdAt')
);

// get collection data
// getDocs(colRef)
// 	.then((snapshot) => {
// 		const books = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
// 		console.log(books);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// get realtime collection data
const unsubCol = onSnapshot(queryRef, (snapshot) => {
	// onSnapshot(colRef, (snapshot) => {
	const books = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
	console.log(books);
});

// adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
	e.preventDefault();
	addDoc(colRef, {
		title: addBookForm.title.value,
		author: addBookForm.author.value,
		createdAt: serverTimestamp(),
	}).then(() => {
		addBookForm.reset();
	});
});

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const docRef = doc(db, 'books', deleteBookForm.id.value);
	deleteDoc(docRef).then(() => {
		deleteBookForm.reset();
	});
});

// get a single document
const docRef = doc(db, 'books', 'DZJ14m9TEAYrAX66k6bN');
getDoc(docRef).then((doc) => {
	console.log(doc.data(), doc.id);
});

// get a real time single document.
const unsubDoc = onSnapshot(docRef, (doc) => {
	console.log(doc.data(), doc.id);
});

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const docRef = doc(db, 'books', updateForm.id.value);
	updateDoc(docRef, { title: 'updated title' }).then(() => {
		updateForm.reset();
	});
});

// Signing users up
const signupForm = document.querySelector('.signup');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	createUserWithEmailAndPassword(
		auth,
		signupForm.email.value,
		signupForm.password.value
	)
		.then((cred) => {
			console.log('user created:', cred.user);
			signupForm.reset();
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// logging out
const logoutButton = document.querySelector('.logout');
logoutButton.addEventListener('click', () => {
	signOut(auth)
		.then(() => {
			// console.log('the user signed out');
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// logging in
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
	e.preventDefault();
	signInWithEmailAndPassword(
		auth,
		loginForm.email.value,
		loginForm.password.value
	)
		.then((cred) => {
			// console.log('user signed in', cred.user);
			loginForm.reset();
		})
		.catch((err) => {
			console.log(err.message);
		});
});

const unsubAuth = onAuthStateChanged(auth, (user) => {
	console.log('user status changed:', user);
});

const unsubButton = document.querySelector('.unsub');
unsubButton.addEventListener('click', () => {
	console.log('unsubscribing');
	unsubCol();
	unsubDoc();
	unsubAuth();
});
