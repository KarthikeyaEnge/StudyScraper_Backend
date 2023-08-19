const { TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

require("dotenv").config();

const MODEL_NAME = "models/text-bison-001";
const API_KEY = process.env.PALM_API;

const palmController = async (promptString) => {
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(API_KEY),
  });

  /* const promptString = `Unit I - Operating System Overview, Process Management
Operating System Overview: Operating system functions and
services, Overview of computer operating systems, distributed and
special purpose systems, System calls and system programs,
Operating system structure.
Process Management: Process concepts, Threads, Scheduling-
criteria, Scheduling algorithms (FCFS, SJF, Priority), Scheduling
algorithms (RR, Multilevel queue, Multilevel feedback queue).
Unit II — Synchronization, Deadlocks
Synchronization: The critical- section problem and Peterson's
solution, Synchronization hardware, Semaphores, Classic problems
of synchronization, Monitors.
Deadlocks: Deadlock characterization, Deadlock prevention,
Deadlock avoidance (Banker's algorithm), Deadlock detection and
recovery
Unit Ill - Memory-Management Strategies, Virtual-memory
Management
Memory-Management Strategies: Contiguous memory allocation,
Paging, Structure of the page table, Segmentation.
Virtual-memory Management: Virtual memory and demand
paging, Introduction to page replacement& page replacement
algorithms (FIFO, Optimal). (LRU, LRU variations, Counting based),
Allocation of frames and thrashing.


extract all the concepts by removing all the brackets in above text as comma seperated text
`; */
  const stopSequences = [];

  const result = await client.generateText({
    // required, which model to use to generate the result
    model: MODEL_NAME,
    // optional, 0.0 always uses the highest-probability result
    temperature: 0.7,
    // optional, how many candidate results to generate
    candidateCount: 1,
    // optional, number of most probable tokens to consider for generation
    top_k: 40,
    // optional, for nucleus sampling decoding strategy
    top_p: 0.95,
    // optional, maximum number of output tokens to generate
    max_output_tokens: 1024,
    // optional, sequences at which to stop model generation
    stop_sequences: stopSequences,
    // optional, safety settings
    safety_settings: [
      { category: "HARM_CATEGORY_DEROGATORY", threshold: 1 },
      { category: "HARM_CATEGORY_TOXICITY", threshold: 1 },
      { category: "HARM_CATEGORY_VIOLENCE", threshold: 2 },
      { category: "HARM_CATEGORY_SEXUAL", threshold: 2 },
      { category: "HARM_CATEGORY_MEDICAL", threshold: 2 },
      { category: "HARM_CATEGORY_DANGEROUS", threshold: 2 },
    ],
    prompt: {
      text: `${promptString}\n\nextract all the concepts by removing all the brackets in above text as comma seperated text`,
    },
  });

  console.log(result[0]?.candidates[0]?.output);
  /* .then((result) => {
      console.log(result[0].candidates[0].output);
      return result[0].candidates[0].output;
    }); */
  const data = await result[0]?.candidates[0]?.output;
  return data;
};

module.exports = palmController;