import { db } from "../lib/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

// Komponen Kartu (UI Sederhana)
const Card = ({ card, onClick }) => {
  const bgColors = { red: "bg-red-500", blue: "bg-blue-500", green: "bg-green-500", yellow: "bg-yellow-500", black: "bg-gray-900" };
  return (
    <div 
      onClick={onClick}
      className={`${bgColors[card.color]} w-16 h-24 rounded-lg border-4 border-white flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:-translate-y-2 transition`}
    >
      {card.value}
    </div>
  );
};

export default function GameBoard({ roomId, user }) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "rooms", roomId), (doc) => {
      setRoom(doc.data());
    });
    return unsub;
  }, [roomId]);

  if (!room) return <p>Loading Meja...</p>;

  const myPlayerData = room.players.find(p => p.uid === user.uid);
  const isMyTurn = room.players[room.turn]?.uid === user.uid;

  // Fungsi Buang Kartu
  const playCard = async (cardPlayed) => {
    if (!isMyTurn) return alert("Belum giliranmu!");
    
    // LOGIKA VALIDASI UNO (Warna sama atau Angka sama atau Wildcard)
    const isValid = cardPlayed.color === room.currentCard.color || 
                    cardPlayed.value === room.currentCard.value || 
                    cardPlayed.color === 'black';

    if (!isValid) return alert("Kartu tidak valid!");

    // Update state pemain
    const updatedPlayers = room.players.map(p => {
      if (p.uid === user.uid) {
        return { ...p, hand: p.hand.filter(c => c.id !== cardPlayed.id) };
      }
      return p;
    });

    // Pindah giliran ke pemain berikutnya (Logika sederhana maju 1 langkah)
    let nextTurn = room.turn + 1;
    if (nextTurn >= room.players.length) nextTurn = 0;

    await updateDoc(doc(db, "rooms", roomId), {
      currentCard: cardPlayed,
      players: updatedPlayers,
      turn: nextTurn
    });
  };

  return (
    <div className="min-h-screen bg-green-800 p-10 flex flex-col items-center justify-between">
      {/* Lawan (Sederhana: Tampilkan jumlah kartu lawan) */}
      <div className="text-white text-center">
        Lawan: {room.players.find(p => p.uid !== user.uid)?.username || "Menunggu lawan..."}
      </div>

      {/* Tengah (Kartu Meja) */}
      <div className="text-center my-10">
        <h2 className="text-white mb-4">Kartu di Meja</h2>
        <div className="flex justify-center">
          <Card card={room.currentCard} />
        </div>
        <p className="text-white mt-4 font-bold text-xl">
          {isMyTurn ? "🔥 GILIRANMU! 🔥" : "Menunggu giliran lawan..."}
        </p>
      </div>

      {/* Kartu Kamu */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <h2 className="text-white mb-2">Kartu Kamu:</h2>
        <div className="flex gap-2 pb-4">
          {myPlayerData?.hand.map(card => (
            <Card key={card.id} card={card} onClick={() => playCard(card)} />
          ))}
        </div>
      </div>
    </div>
  );
}
