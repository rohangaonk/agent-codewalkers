import { formatDocumentsAsString } from "langchain/util/document";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { MistralAIEmbeddings, ChatMistralAI } from "@langchain/mistralai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as fs from 'fs';

process.env.MISTRAL_API_KEY="vYKsUneUgfrUsClt9OhMqCcBNRKik8EB"
process.env.ATLAS_CONNECTION_STRING = "mongodb+srv://royy3184:seikTNgEoJkcm44b@cluster0.ce8u5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

async function run() {
    try {
      // Configure your Atlas collection
      const database = client.db("langchain_db");
      const collection = database.collection("test");
      const dbConfig = {  
        collection: collection,
        indexName: "vector_index", // The name of the Atlas search index to use.
        textKey: "text", // Field name for the raw text content. Defaults to "text".
        embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
      };
      
      // Ensure that the collection is empty
    //   const count = await collection.countDocuments();
    //   if (count > 0) {
    //     await collection.deleteMany({});
    //   }
  
    //   // Save online PDF as a file
    //   const rawData = await fetch("https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE4HkJP");
    //   const pdfBuffer = await rawData.arrayBuffer();
    //   const pdfData = Buffer.from(pdfBuffer);
    //   fs.writeFileSync("atlas_best_practices.pdf", pdfData);
  
    //   // Load and split the sample data
    //   const loader = new PDFLoader(`atlas_best_practices.pdf`);
    //   const data = await loader.load();
    //   const textSplitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 200,
    //     chunkOverlap: 20,
    //   });
    //   const docs = await textSplitter.splitDocuments(data);
  
      // Instantiate Atlas as a vector store
    const vectorStore = new MongoDBAtlasVectorSearch(new MistralAIEmbeddings({model: 'mistral-embed'}), dbConfig);

      // Ensure index does not already exist, then create your Atlas Vector Search index
      /************ */
    // const indexes = await collection.listSearchIndexes("vector_index").toArray();
    // if(indexes.length === 0){

    // // Define your Atlas Vector Search Index
    // const index = {
    //     name: "vector_index",
    //     type: "vectorSearch",
    //     definition: {
    //         "fields": [
    //             {
    //             "type": "vector",
    //             "numDimensions": 1024,
    //             "path": "embedding",
    //             "similarity": "cosine"
    //             },
    //             {
    //             "type": "filter",
    //             "path": "loc.pageNumber"
    //             }
    //         ]
    //     }
    // }

    /********* */

    // Run the helper method
    // const result = await collection.createSearchIndex(index);
    // console.log(result);

    // // Wait for Atlas to sync index
    // console.log("Waiting for initial sync...");
    // await new Promise(resolve => setTimeout(() => {
    //     resolve();
    // }, 10000));
    
  
    /************ */
    // Basic semantic search
    const basicOutput = await vectorStore.similaritySearch("MongoDB Atlas security");
    const basicResults = basicOutput.map((results => ({
    pageContent: results.pageContent,
    pageNumber: results.metadata.loc.pageNumber,
    })))

    console.log("Semantic Search Results:")
    console.log(basicResults)

    /**************/ 
        } finally {
      // Ensure that the client will close when you finish/error
      await client.close();
    }
}
  
  run().catch(console.dir);