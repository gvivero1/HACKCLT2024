import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore"; 
import { app } from './firebase'; // assuming firebase.js is in the same directory
import bcrypt from 'bcrypt';
import { name } from "ejs";

const db = getFirestore(app);

async function createUser(email, password, name) {
    const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userRef = doc(db, 'users', email); // 'users' is the collection name

  // 'email' is the document ID
  await setDoc(userRef, {
    email: email,
    password: hashedPassword, // Note: In a real-world application, never store passwords in plain text
    name: name
});

  await updateDoc(userRef, {
    
  });
}


export { createUser };