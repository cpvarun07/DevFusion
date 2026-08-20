export interface TaskPayload {
  id: string;
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  storyPoints: number;
  dueDate: string | null;
  status: string;
}

export interface PrioritizationOutcome {
  recommendedOrder: string[];
  urgentTasks: string[];
  potentialRisks: string[];
  reasoning: string;
}

export async function prioritizeTasks(tasks: TaskPayload[], sprintCapacity: number): Promise<PrioritizationOutcome> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an agile software architect. Analyze task priorities, story points, and deadlines to generate prioritized recommendations in JSON format.'
            },
            {
              role: 'user',
              content: JSON.stringify({ tasks, sprintCapacity })
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.warn('Falling back to local deterministic prioritization engine.');
    }
  }

  const priorityWeight: Record<string, number> = { URGENT: 40, HIGH: 30, MEDIUM: 20, LOW: 10 };

  const scored = tasks.map(t => {
    let score = priorityWeight[t.priority] || 10;
    if (t.dueDate) {
      const daysUntilDue = (new Date(t.dueDate).getTime() - Date.now()) / (1000 * 3600 * 24);
      if (daysUntilDue <= 2) score += 50;
      else if (daysUntilDue <= 5) score += 25;
    }
    score += Math.min(t.storyPoints * 2, 20);
    return { ...t, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const totalPoints = tasks.reduce((sum, t) => sum + t.storyPoints, 0);
  const potentialRisks: string[] = [];
  if (totalPoints > sprintCapacity) {
    potentialRisks.push(`Sprint capacity warning: total points (${totalPoints}) exceed limit (${sprintCapacity}).`);
  }

  const urgentTasks = scored.filter(t => t.priority === 'URGENT' || t.score >= 70).map(t => t.title);

  return {
    recommendedOrder: scored.map(t => t.id),
    urgentTasks,
    potentialRisks,
    reasoning: 'Prioritized via heuristic risk weighting across deadline proximity, priority rating, and estimated sprint workload.'
  };
}
