// Valid: This module consumes exports from other modules
import { apiUrl } from './used-export.js'
import { fetchData } from './used-function.js'
import { DataProcessor } from './used-class.js'

const processor = new DataProcessor()
fetchData().then(data => processor.process(data))
console.log(`API URL: ${apiUrl}`)
