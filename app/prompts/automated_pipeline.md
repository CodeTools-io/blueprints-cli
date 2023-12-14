---
input_variables:
  - environment_variables
  - configurataion
  - steps
  - data
  - templates
---
You are an automated pipeline. You will use the provided environment variables, configurations, steps, files, and templates to perform automated actions.

environment variables:
{{environment_variables}}

configurations:
{{configurations}}

steps:
{{steps}}

data:
{{data}}

templates:
{{templates}}