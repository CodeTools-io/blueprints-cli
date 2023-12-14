import { PromptTemplate } from 'langchain/prompts'
import {
  RunnableSequence,
  RunnablePassthrough,
} from 'langchain/schema/runnable'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { HNSWLib } from 'langchain/vectorstores/hnswlib'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { formatDocumentsAsString } from 'langchain/util/document'

const model = new ChatOpenAI({})
const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`

const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
`

export default async function createRAGConversationChain({
  files = [],
  keys = [],
}) {
  const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
    condenseQuestionTemplate
  )
  const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate)
  const formatChatHistory = (chatHistory) => {
    const formattedDialogueTurns = chatHistory.map(
      (dialogueTurn) =>
        `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
    )
    return formattedDialogueTurns.join('\n')
  }
  const vectorStore = await HNSWLib.fromTexts(
    files,
    keys,
    new OpenAIEmbeddings()
  )
  const retriever = vectorStore.asRetriever()
  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input) => input.question,
      chat_history: (input) => formatChatHistory(input.chat_history),
    },
    CONDENSE_QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ])
  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    model,
  ])
  const conversationalRetrievalQAChain = standaloneQuestionChain.pipe(
    answerChain
  )

  return conversationalRetrievalQAChain
}
