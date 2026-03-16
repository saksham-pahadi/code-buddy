export async function analyzeCodeLocal(code: string): Promise<any> {
  try{
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-coder:1.3b",
      prompt:  `
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

keep the format same as above strictly. Do not add any extra text.

Code:
${code}
`
,
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
  const cleaned = raw.response.replace(/\/\/.*$/gm, "");
  console.log("Cleaned response from local API:", cleaned);
  const objResponse = JSON.parse(cleaned);
  console.log("Parsed object response from local API:", objResponse);
  return { done: true,error: false, response: objResponse };
  }catch(err){
    console.error("Error parsing JSON from local API:", err);
    return {  done: false,error: true };
  }



  
  
}





export async function analyzeCodeCloud(code: string) {

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
}catch(err){
  console.error("Error in analyzeCodeCloud:", err);
  return { done: true,error: true };
}
}

export async function analyzeCode(code: string) {
  if (process.env.NODE_ENV === "development") {
    return analyzeCodeCloud(code);
  } else {
    return analyzeCodeLocal(code);
  }
}
