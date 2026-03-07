import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, onSnapshot, getDoc, doc, updateDoc } from "firebase/firestore";
import { createDeck } from "../utils/unoLogic";
import { useRouter } from "next/router";

export default function Lobby({ user, myUsername }) {
  const [inviteTarget, setInviteTarget] = useState("");
  const [myInvites, setMyInvites] = useState([]);
  const router = useRouter();

  // Pantau undangan masuk
  useEffect(() => {
    const q = query(collection(db, "rooms"), where("invitedUsers", "array-contains", myUsername));
    const unsub = onSnapshot(q, (snapshot) => {
      setMyInvites(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [myUsername]);

  const createRoom = async () => {
    if (!inviteTarget) return alert("Masukkan username teman!");
    const deck = createDeck();
    const initialCard = deck.pop();
    
    const docRef = await addDoc(collection(db, "rooms"), {
      host: myUsername,
      status: "waiting",
      invitedUsers: [inviteTarget.toLowerCase()],
      players: [{ uid: user.uid, username: myUsername, hand: deck.splice(0, 7) }],
      deck: deck,
      currentCard: initialCard,
      turn: 0,
      direction: 1,
      createdAt: new Date()
    });
    router.push(`/room/${docRef.id}`);
  };

  const joinRoom = async (roomId) => {
    const roomRef = doc(db, "rooms", roomId);
    const snap = await getDoc(roomRef);
    const data = snap.data();

    if (!data.players.find(p => p.uid === user.uid)) {
      let currentDeck = [...data.deck];
      const newHand = currentDeck.splice(0, 7);
      await updateDoc(roomRef, {
        players: [...data.players, { uid: user.uid, username: myUsername, hand: newHand }],
        deck: currentDeck,
        status: "playing"
      });
    }
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="w-full max-w-md bg-gray-900 border border-cyan-900 p-6 rounded-2xl shadow-2xl">
      <h2 className="text-xl font-bold text-cyan-400 mb-6 uppercase tracking-tighter">Command Center</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-cyan-700 uppercase mb-1 block">Invite Player</label>
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-black border border-cyan-900 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              placeholder="Username..."
              value={inviteTarget}
              onChange={(e) => setInviteTarget(e.target.value)}
            />
            <button onClick={createRoom} className="bg-cyan-600 hover:bg-cyan-400 text-black font-bold px-4 py-2 rounded-lg transition-colors">
              CREATE
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-cyan-900">
          <h3 className="text-xs text-cyan-700 uppercase mb-3">Incoming Invites</h3>
          {myInvites.length === 0 ? (
            <p className="text-gray-600 italic text-sm text-center py-4">No active invites...</p>
          ) : (
            myInvites.map(room => (
              <div key={room.id} className="flex justify-between items-center bg-black border border-cyan-900/30 p-3 rounded-xl mb-2">
                <span className="text-sm font-mono text-cyan-100">@{room.host}</span>
                <button onClick={() => joinRoom(room.id)} className="text-xs bg-white text-black px-3 py-1 rounded-full font-bold hover:bg-cyan-400 transition-colors">
                  ACCEPT
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
