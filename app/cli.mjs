#!/usr/bin/env node

import app from './app.mjs'

async function main() {
  try {
    await app.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
