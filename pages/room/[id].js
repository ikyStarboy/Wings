import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import GameBoard from '../../components/GameBoard';
import { useGame } from '../../hooks/useGame';

export default function RoomPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user] = useAuthState(auth);
  const { room, loading, error } = useGame(id);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono">MEMUAT ARENA...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black">
      <GameBoard roomId={id} user={user} roomData={room} />
    </div>
  );
}
