import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth"; // Install ini: npm install react-firebase-hooks

export default function Login() {
  const [user, loading] = useAuthState(auth);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Berhasil Login!");
    } catch (error) {
      console.error("Gagal Login:", error.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      {!user ? (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">ZEDX UNO</h1>
          <button 
            onClick={handleLogin}
            className="flex items-center bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6 mr-2" alt="google" />
            Main Pake Google
          </button>
        </div>
      ) : (
        <div className="text-center">
          <img src={user.photoURL} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-yellow-400" />
          <p className="text-xl">Halo, <strong>{user.displayName}</strong>!</p>
          <button 
            onClick={() => signOut(auth)}
            className="mt-4 text-sm text-red-400 underline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
