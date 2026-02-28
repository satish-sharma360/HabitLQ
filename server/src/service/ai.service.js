import OpenAI from 'openai'
import aichatModel from '../model/aichat.model.js';
import "dotenv/config"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const askCoach = async (user , habits , logs , message) =>{
    const prompt = `
    User Level : ${user.level}
    Current XP :${user.xp}
    habits : ${habits.map(h => h.name).join(", ")}
    message:${message}

    Give motivational advice and improvement suggestions.
    `;

    const response =  await openai.chat.completions.create({
        model:"gpt-4o-mini",
        messages:[{role:"user", content:prompt}]
    })

    const aiReply = response.choices[0].message.content;

    await aichatModel.create({
        userId:user._id,
        message,
        response:aiReply
    })

    return aiReply
}

export {askCoach}