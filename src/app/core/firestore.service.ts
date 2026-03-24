import { Injectable, signal, effect, inject } from '@angular/core';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { Transaction, Rate } from './models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  transactions = signal<Transaction[]>([]);
  rates = signal<Rate[]>([]);
  allTransactions = signal<Transaction[]>([]); // For admin

  private authService = inject(AuthService);

  constructor() {
    this.listenToRates();
    
    // Listen to user transactions when logged in
    effect(() => {
      const profile = this.authService.userProfile();
      if (profile) {
        this.listenToUserTransactions(profile.uid);
        if (profile.role === 'admin') {
          this.listenToAllTransactions();
        }
      } else {
        this.transactions.set([]);
        this.allTransactions.set([]);
      }
    });
  }

  listenToRates() {
    const q = collection(db, 'rates');
    onSnapshot(q, (snapshot) => {
      const ratesList = snapshot.docs.map(doc => doc.data() as Rate);
      this.rates.set(ratesList);
    });
  }

  listenToUserTransactions(userId: string) {
    const q = query(
      collection(db, 'transactions'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const txList = snapshot.docs.map(doc => doc.data() as Transaction);
      this.transactions.set(txList);
    });
  }

  listenToAllTransactions() {
    const q = query(
      collection(db, 'transactions'),
      orderBy('createdAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const txList = snapshot.docs.map(doc => doc.data() as Transaction);
      this.allTransactions.set(txList);
    });
  }

  async createTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>) {
    const txRef = doc(collection(db, 'transactions'));
    const newTx: Transaction = {
      ...tx,
      id: txRef.id,
      createdAt: new Date().toISOString()
    };
    await setDoc(txRef, newTx);
    return newTx;
  }

  async updateTransactionStatus(txId: string, status: 'approved' | 'rejected') {
    const txRef = doc(db, 'transactions', txId);
    await updateDoc(txRef, { status });
  }

  async updateRate(asset: string, rate: number) {
    const rateRef = doc(db, 'rates', asset);
    await setDoc(rateRef, {
      asset,
      rate,
      updatedAt: new Date().toISOString()
    });
  }
}
