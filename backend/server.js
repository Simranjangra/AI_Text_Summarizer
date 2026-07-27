const express = require("express");

const cors = require("cors");

require("dotenv").config();



const { GoogleGenerativeAI } = require("@google/generative-ai");



const app = express();



app.use(cors());

app.use(express.json());



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



app.post("/summarize", async (req, res) => {



    try {



        const { text,tone } = req.body;



        if (!text) {

            return res.status(400).json({

                summary: "Please provide some text."

            });

        }



        const model = genAI.getGenerativeModel({

            model: "gemini-3.5-flash"

        });



        let instruction = "";



switch (tone) {



    case "professional":

        instruction = `

You are an expert editor.



Summarize the text in a professional and formal tone.



Use clear business language.



Keep paragraph formatting.

`;

        break;



    case "bullet":

        instruction = `

Summarize the text using bullet points.



Use short and clear points.



Do not write long paragraphs.

`;

        break;



    case "student":

        instruction = `

Summarize the text like study notes.



Use very simple English.



Highlight the important concepts.



Keep it easy for students.

`;

        break;



    default:

        instruction = `

Summarize the text in simple English.



Keep the summary concise.



Maintain paragraph formatting.

`;

}



const prompt = `

${instruction}



Text:

${text}

`;



        const result = await model.generateContent(prompt);



        const summary = result.response.text();



        res.json({

            summary

        });



    } catch (error) {



        console.log(error);



        res.status(500).json({

            summary: "Something went wrong."

        });



    }



});



app.listen(5000, () => {

    console.log("Server running on http://localhost:5000");

});