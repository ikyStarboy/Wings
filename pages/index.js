import { useState } from "react";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../components/Login";
import Profile from "../components/Profile";
import Lobby from "../components/Lobby";
import GameBoard from "../components/GameBoard";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [roomId, setRoomId] = useState(null);

  // Layar Loading dengan aksen Cyan
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 flex items-center justify-center font-mono">
        MENGINISIALISASI SISTEM...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-100 font-sans selection:bg-cyan-900">
      {/* Navbar Minimalis */}
      <header className="p-4 border-b border-cyan-900 flex justify-between items-center shadow-[0_0_15px_rgba(0,255,255,0.05)]">
        <h1 className="text-2xl font-bold tracking-widest text-cyan-400">
          ZEDX<span className="text-white">UNO</span>
        </h1>
        
        {/* Menampilkan Username tanpa Foto Profil untuk UI yang lebih clean */}
        {user && username && (
          <div className="text-sm bg-gray-900 px-4 py-1 border border-cyan-800 rounded-full">
            <span className="text-gray-500">ID: </span>
            <span className="font-mono text-cyan-300">@{username}</span>
          </div>
        )}
      </header>

      {/* Area Konten Utama */}
      <main className="container mx-auto p-4 flex justify-center mt-10">
        {!user ? (
          <Login />
        ) : !username ? (
          <Profile user={user} onProfileReady={(uname) => setUsername(uname)} />
        ) : !roomId ? (
          <Lobby user={user} myUsername={username} onJoinRoom={(id) => setRoomId(id)} />
        ) : (
          <GameBoard roomId={roomId} user={user} />
        )}
      </main>
    </div>
  );
}
