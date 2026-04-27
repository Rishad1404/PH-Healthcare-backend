import { envVars } from "../../../config/env";

export class EmbeddingService {
    private apikey:string;
    private apiUrl:string = "https://openrouter.ai/api/v1"
    private embeddingModel:string;

    constructor(){
        this.apikey=envVars.RAG.OPENROUTER_API_KEY || "";
        this.embeddingModel=envVars.RAG.OPENROUTER_EMBEDDING_MODEL || "nvidia/llama-nemotron-embed-vl-1b-v2:free";

        if(!this.apikey){
            throw new Error("OPENROUTER_API_KEY is not set in .env file");
        }
    }

    async generateEmbedding(text:string) {
        try {
            const response=await fetch(`${this.apiUrl}/embeddings`,{
                method:"POST",
                headers: {
                    Authorization: `Bearer ${this.apikey}`,
                    "Content-Type": "application/json",
                },
                body:JSON.stringify({
                    input:text,
                    model:this.embeddingModel
                })
            });
            if(!response.ok){
                throw new Error(`OpenRouter API returned ${response.status}`);
            }
            const data=await response.json();
            if(!data.data || data.data.length ==0){
                throw new Error("No embedding data returned from OpenRouter API");
            }
            return data.data[0].embedding;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}