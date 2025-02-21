
import 'dotenv/config';
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb"
import { Collection, MongoClient } from "mongodb";

// const documents = [
//   new Document({
//     pageContent:
//       "Dogs are great companions, known for their loyalty and friendliness.",
//     metadata: { source: "mammal-pets-doc" },
//   }),
//   new Document({
//     pageContent: "Cats are independent pets that often enjoy their own space.",
//     metadata: { source: "mammal-pets-doc" },
//   }),
// ];



// const loader = new PDFLoader("./atlas_best_practices.pdf");

// const docs = await loader.load();
// console.log(docs.length)



// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 200,
//   chunkOverlap: 20,
// });

// const allSplits = await textSplitter.splitDocuments(docs);


// const getEmbeddings = () =>{

//   const embeddings = new MistralAIEmbeddings({
//     model: "mistral-embed"
//   });

// // const vector1 = await embeddings.embedQuery(allSplits[0].pageContent);
// // const vector2 = await embeddings.embedQuery(allSplits[1].pageContent);

// // console.assert(vector1.length === vector2.length);
// // console.log(`Generated vectors of length ${vector1.length}\n`);
// // console.log(vector1.slice(0, 10));

// return embeddings;
// }

// const saveToVectorStore = async (embeddings:MistralAIEmbeddings, allSplits:Document[]) => {
  
//   const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
//   const collection = client
//     .db("pdfs")
//     .collection("nike_pdf");
  
//   const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
//     collection: collection,
//     indexName: "vector_index",
//     textKey: "text",
//     embeddingKey: "embedding",
//   });
//   await vectorStore.addDocuments(allSplits);
// }

// const embeddings = getEmbeddings();
// await saveToVectorStore(embeddings, allSplits)
const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
const search = async(query: string) => {

  const collection = client
    .db("pdfs")
    .collection("nike_pdf");
  
  const vectorStore = new MongoDBAtlasVectorSearch(new MistralAIEmbeddings({
    model: "mistral-embed"
  }),{
    collection: collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  const results1 = await vectorStore.similaritySearch(
    query
  );
  return results1
}


const createIndex = async(client: MongoClient) => {
  const collection = client
  .db("pdfs")
  .collection("nike_pdf");
    const indexes = await collection.listSearchIndexes("vector_index").toArray();
    if(indexes.length === 0){

    // Define your Atlas Vector Search Index
    const index = {
        name: "vector_index",
        type: "vectorSearch",
        definition: {
            "fields": [
                {
                "type": "vector",
                "numDimensions": 1024,
                "path": "embedding",
                "similarity": "cosine"
                },
                {
                "type": "filter",
                "path": "loc.pageNumber"
                }
            ]
        }
    }
    const result = await collection.createSearchIndex(index);
}
}

try{
  // await createIndex(client)
  const results = await search('what are the types of sharding supported in mongodb?');
  for (const res of results){
     console.log(res)
     console.log('\n')
  }
}
catch(err){
  console.log(err);
}
finally {
await client.close()
}



