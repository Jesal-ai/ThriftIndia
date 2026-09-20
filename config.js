// Add your OpenCage API key here. In production, proxy geocoding requests through your server.
window.OPENCAGE_API_KEY = '9581992c6a3a42b2861728748bad29a7';
// config.js
const firebaseConfig = {
  apiKey: "AIzaSyDLz-W7FtAPc9JpLmhb-CwrY-yRplDUOKY",
  authDomain: "thrift-india-82ce7.firebaseapp.com",
  projectId: "thrift-india-82ce7",
  storageBucket: "thrift-india-82ce7.firebasestorage.app",
  messagingSenderId: "121493886406",
  appId: "1:121493886406:web:fdb59fac99ba4df4324ec7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();
window.auth = auth;
window.db = db;
