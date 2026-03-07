import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { createDeck } from "../utils/unoLogic";

export default function Lobby({ user, myUsername, onJoinRoom }) {
  const [inviteUsername, setInviteUsername] = useState("");
  const [myInvites, setMyInvites] = useState([]);

  // Dengerin kalau ada yang invite username kita
  useEffect(() => {
    const q = query(collection(db, "rooms"), where("invitedUsers", "array-contains", myUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyInvites(invites);
    });
    return unsub;
  }, [myUsername]);

  const createRoomAndInvite = async () => {
    if (!inviteUsername) return alert("Isi username temanmu!");
    
    // Setup awal game
    const deck = createDeck();
    const initialCard = deck.pop(); // Taruh 1 kartu di meja

    const roomRef = await addDoc(collection(db, "rooms"), {
      host: user.uid,
      status: "waiting",
      invitedUsers: [inviteUsername.toLowerCase()], // Invite masuk ke sini
      players: [{ uid: user.uid, username: myUsername, hand: deck.splice(0, 7) }], // Host langsung dapet 7 kartu
      deck: deck,
      currentCard: initialCard,
      turn: 0
    });
    
    onJoinRoom(roomRef.id);
  };

  return (
    <div className="p-10 border-2 border-gray-700 rounded-lg mt-5">
      <h2 className="text-2xl font-bold mb-4">Lobby</h2>
      
      <div className="mb-8 p-4 bg-gray-800 rounded">
        <h3 className="mb-2">Buat Room & Invite Teman</h3>
        <input 
          type="text" 
          placeholder="Username teman..." 
          value={inviteUsername} 
          onChange={(e) => setInviteUsername(e.target.value)}
          className="text-black p-2 rounded mr-2"
        />
        <button onClick={createRoomAndInvite} className="bg-green-500 p-2 rounded text-white">Buat & Invite</button>
      </div>

      <div className="p-4 bg-gray-800 rounded">
        <h3>Undangan Masuk untuk @{myUsername}:</h3>
        {myInvites.length === 0 ? <p className="text-gray-400">Belum ada undangan...</p> : (
          myInvites.map(room => (
            <div key={room.id} className="flex justify-between items-center bg-gray-700 p-2 mt-2 rounded">
              <span>Room dari Host: {room.host}</span>
              <button onClick={() => onJoinRoom(room.id)} className="bg-blue-500 p-1 px-4 rounded text-white">Join</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
