

const admin = require("firebase-admin");
const serviceAccount = require("./config/hackclt-2024-firebase-adminsdk-vqrlg-97b5d2cb9e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/project/hackclt-2024/firestore/databases/-default-/data/~2F'
});

const auth = admin.auth();

module.exports = {
    async login(details) {
      const { email, password } = details;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        return auth.currentUser;
      } catch (error) {
        throw error; // Handle errors as needed
      }
    },
    async register(details) {
      const { email, password } = details;
      try {
        const userRecord = await auth.createUser({
          email,
          password
        });
        return userRecord;
      } catch (error) {
        throw error; // Handle errors as needed
      }
    },
    async logout() {
      try {
        await auth.signOut();
      } catch (error) {
        throw error; // Handle errors as needed
      }
    }
}