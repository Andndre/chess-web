export type AIMode = 'easy' | 'monkey' | 'no-ai';
export const getAI = (ai: string) => {
	if (['easy', 'monkey', 'no-ai'].indexOf(ai) === -1) {
		return 'no-ai' as AIMode;
	}
	return ai as AIMode;
};
