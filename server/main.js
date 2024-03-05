import express from 'express';
import * as path from 'path';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import pkg from 'openai';
const { Configuration, OpenAIApi, } = pkg;


import {enrichWithWammy} from "./utils.js";

// Loads environment variables from .env
dotenv.config({ path:'./doNotDeploy/.env' });

// initializes the express app
export const app = express()

// Parses application request as JSON
app.use(bodyParser.json())

// Sets the path for the app to serve static files from the client folder
app.use(express.static(path.join(process.cwd(), 'client')))

// Serves the app homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'client/bot-app.html'));
});

// Sends the user's input to OpenAPI
app.post('/api/openai', async (req, res) => {
  const { question } = req.body;
  const response = await fetch('https://api.openai.com/v1/chat/completions',{
    method: 'POST',
    headers: {

        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },

        // Constructs the OpenAI request payload
        body: JSON.stringify({

        // Assigns the model as the custom chewybot model
        //model: 'davinci:ft-liz:v2chewybot-2023-03-17-21-58-11',

        // Assigns the model as GPT-4
        model: 'gpt-4',

        //Sets GPT-4 request parameters
        messages:[
                  // Sets the Wammy context
                  {role: "user", content: enrichWithWammy(question)}

                  // Sets the GPT-4 defualt context
                  //{role: "user", content: question}
                ],

        // Sets tokens parameters for custom models
        //max_tokens: 100,
        //temperature: .8,
        //for base models
        //max_tokens=100
        //temperature=.8
    }),
});

      // Parses the response from OpenAI as JSON
      const data = await response.json();

      // Sets the GPT-4 response parameters
      res.json({ content: data.choices[0].message.content });

      // Sets the custom model parameters (check the OpenAPI documentation for the most current parameters)
      //res.json({ data: data.choices[0].text });
});

// Sets the port to the one specificied in the .env
// If no port is specified sets the port to 2626
const PORT = process.env.PORT || 2626;

// Initializes the express server
app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}!`));
