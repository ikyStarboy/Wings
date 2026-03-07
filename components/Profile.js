import { useState, useEffect } from "react";
import { db, auth } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Profile({ user, onProfileReady }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().username) {
        onProfileReady(docSnap.data().username);
      }
      setLoading(false);
    };
    checkProfile();
  }, [user]);

  const saveProfile = async () => {
    if (username.length < 3) return alert("Username minimal 3 huruf!");
    // Catatan: Di versi production, kamu harus cek dulu apakah username ini udah dipakai orang lain
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      username: username.toLowerCase(),
    });
    onProfileReady(username.toLowerCase());
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl mb-4">Pilih Username Kamu</h2>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="contoh: zedxgamer"
        className="text-black p-2 rounded border-2 border-blue-500 mr-2"
      />
      <button onClick={saveProfile} className="bg-blue-500 text-white p-2 rounded">Simpan</button>
    </div>
  );
}
