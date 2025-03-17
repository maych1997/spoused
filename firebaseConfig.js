import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyA4oIO--YPkTJrpHOcUtxvStg9156RlJc0',
    authDomain: 'project-id.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'project-id',
    storageBucket: 'project-id.appspot.com',
    messagingSenderId: 'sender-id',
    appId: 'app-id',
    measurementId: 'G-measurement-id',
  };
  
  const app = initializeApp(firebaseConfig);