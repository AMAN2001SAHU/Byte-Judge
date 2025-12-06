import { CheckCircle, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

type Problem = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  solved: boolean;
};

const problems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptance: '48%',
    solved: true,
  },
  {
    id: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    acceptance: '41%',
    solved: false,
  },
  {
    id: 3,
    title: 'Longest Substring Without Repeating',
    difficulty: 'Medium',
    acceptance: '34%',
    solved: false,
  },
  {
    id: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    acceptance: '29%',
    solved: false,
  },
];

export default function Problems() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Problems</h2>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Status</th>
              <th className="text-left p-3 font-medium">Title</th>
              <th className="text-left p-3 font-medium">Difficulty</th>
              <th className="text-left p-3 font-medium">Acceptance</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((p) => (
              <tr
                key={p.id}
                onClick={() => {
                  navigate(`/problems/${p.id}`);
                }}
                className="border-b hover:bg-secondary/30 cursor-pointer"
              >
                {/* Status */}
                <td className="p-3">
                  {p.solved ? (
                    <CheckCircle size={18} className="text-green-500" />
                  ) : (
                    <Circle size={18} className="text-muted-foreground" />
                  )}
                </td>

                {/* Title */}
                <td className="p-3 font-medium">{p.title}</td>

                {/* Difficulty */}
                <td className="p-3">
                  <Badge
                    className={
                      p.difficulty === 'Easy'
                        ? 'bg-green-600'
                        : p.difficulty === 'Medium'
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }
                  >
                    {p.difficulty}
                  </Badge>
                </td>

                {/* Acceptance */}
                <td className="p-3 text-muted-foreground">{p.acceptance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
