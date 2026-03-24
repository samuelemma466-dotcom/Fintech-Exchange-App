import { Injectable, signal, inject } from '@angular/core';
import { auth, db } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from './models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  userProfile = signal<UserProfile | null>(null);
  loading = signal<boolean>(true);

  private router = inject(Router);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser.set(user);
      if (user) {
        await this.loadUserProfile(user);
      } else {
        this.userProfile.set(null);
      }
      this.loading.set(false);
    });
  }

  async loadUserProfile(user: User) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.userProfile.set(docSnap.data() as UserProfile);
    } else {
      // Create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        balance: 0,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newProfile);
      this.userProfile.set(newProfile);
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout() {
    await signOut(auth);
    this.router.navigate(['/']);
  }
}
