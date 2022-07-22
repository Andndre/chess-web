export type AIMode = 'easy' | 'monkey' | 'no-ai';
export const getAI = (ai: string) => {
	if (ai !== 'no-ai' && ai !== 'easy' && ai !== 'monkey') {
		return 'no-ai' as AIMode;
	}
	return ai as AIMode;
};
