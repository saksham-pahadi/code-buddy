export async function analyzeCodeLocal(code: string): Promise<any> {
 
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-coder:1.3b",
      prompt: `
//       You are a strict code analyzer.
// Code:${code}
// Analyze the given code and return ONLY valid JSON.
// Do not write anything outside JSON.
// Do not add explanation.
// Do not add markdown.
// Do not add text before or after JSON.

// Required exact this JSON format, nothing should be changed, added, or removed. The JSON should be parsable without any error:

// {
//   "code_explaination": "2-3 line summary",
//   "time_complexity": "O(n) short reason",
//   "space_complexity": "O(n) short reason",
//   "Bug&Error": ["issue1", "issue2"],
//   "optimization": ["improvement1", "improvement2"],
//   "scores": {
//     "readability": 0,
//     "maintainability": 0,
//     "performance": 0,
//     "security": 0
//   }
// }




        `,
        stream: false,
        format: "json",
        options: {
        num_predict: 300,
        temperature: 0.2,
      },
    }),
  });

  // console.log("response from local API:", response);
  // const data = await response.json();
  // console.log("Raw response from local API:", data);
  

  const raw = await response.json();
  console.log("Raw response from local API:", raw);



  
  return raw.response;
}

export async function analyzeCodeCloud(code: string) {

  const prompt = `
You are a strict code analyzer.

Return ONLY JSON.

{
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
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
  console.log("Raw response from cloud API:", data);

  return data.choices[0].message.content
}

export async function analyzeCode(code: string) {
  if (process.env.NODE_ENV === "development") {
    return analyzeCodeCloud(code);
  } else {
    return analyzeCodeLocal(code);
  }
}
