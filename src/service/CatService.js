const API_URL = 'https://api.thecatapi.com/v1/images/search';

export class CatService {
    static async fetchCats(userLimit = 6) {
        const limit = Math.max(Math.min(parseInt(userLimit) || 6, 10), 6);


        try {
            const response = await fetch(`${API_URL}?limit=10`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const limitedData = data.slice(0, limit);
            console.log('API returned:', data.length, 'cats, using:', limitedData.length);

            return limitedData;
        } catch (error) {
            console.error('Error fetching cats:', error);
            throw error;
        }
    }
}