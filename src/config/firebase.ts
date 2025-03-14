import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Essas credenciais são seguras para usar no frontend
// O Firebase já possui restrições de segurança incorporadas
const firebaseConfig = {
  apiKey: "AIzaSyBQZNuNKqxI9NXeNZaZGZnU-H_A7qHhJ-Y",
  authDomain: "cet-calculator.firebaseapp.com",
  projectId: "cet-calculator",
  storageBucket: "cet-calculator.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância de autenticação
export const auth = getAuth(app); 