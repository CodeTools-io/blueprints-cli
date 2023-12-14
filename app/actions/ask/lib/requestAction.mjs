import { PromptTemplate } from 'langchain/prompts'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { RunnableSequence } from 'langchain/schema/runnable'
import {
  OutputFixingParser,
  StructuredOutputParser,
} from 'langchain/output_parsers'
import { z } from 'zod'
import { log } from '../../../utilities.mjs'
const filesTemplate = `Perform the provided action using the provided source files.

{format_instructions}

Action: {action}

Source Files:
{files}
`
const Response = z.object({
  files: z
    .object({
      path: z.string(),
      content: z.string(),
    })
    .array(),
})
const parser = StructuredOutputParser.fromZodSchema(Response)
const fixParser = OutputFixingParser.fromLLM(
  new ChatOpenAI({ temperature: 0 }),
  parser
)
const defaultProps = {
  modelName: 'gpt-4-1106-preview',
  temperature: 0,
}

export default async function requestAction(props = {}) {
  try {
    const { action, files, ...rest } = { ...defaultProps, ...props }
    const model = new ChatOpenAI({ ...rest })
    const formatInstructions = parser.getFormatInstructions()
    const promptTemplate = new PromptTemplate({
      template: filesTemplate,
      inputVariables: ['action', 'files'],
      partialVariables: {
        format_instructions: formatInstructions,
      },
    })
    const chain = RunnableSequence.from([promptTemplate, model, parser])
    const result = await chain.invoke({ action, files })

    return result
  } catch (err) {
    log.output()
    log.error(err.message)
    throw err
    // const output = await fixParser.parse(badOutput)
  }
}
