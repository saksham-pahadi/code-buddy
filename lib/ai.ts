export async function analyzeCode(code: string) {

  const prompt = `
You are a strict code analyzer.

Return ONLY JSON.

{
 "title": "presize title here",
 "code_explaination": "2-3 line summary",
 "time_complexity": "O(n) short reason",
 "space_complexity": "O(n) short reason",
 "Bug&Error": [],
 "optimization": [],
 "scores": {
   "readability": 0,
   "maintainability": 0,
   "performance": 0,
   "security": 0
 }
}

Code:
${code}
`
try{
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": `${process.env.BASE_URL}`, // Adjust this to your actual referer
      "X-Title": "code-buddy"
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    })
  })

  const data = await response.json()
  // console.log("Raw response from cloud API:", data);

  return data.choices[0].message.content
}catch(err){
  console.error("Error in analyzeCodeCloud:", err);
  return { done: true,error: true };
}
}


