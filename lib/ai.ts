export async function analyzeCodeLocal(code: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-coder:1.3b",
      prompt: `
      You are an expert software engineer.
      Analyze the following code carefully.
      Return response strictly in JSON.
      JSON format:
      {
        "summary": "Short 2-3 line explanation of what code does",
        "time_complexity": "Big-O notation with short reason",
        "space_complexity": "Big-O notation with short reason",
        "issues": ["Issue 1", "Issue 2"],
        "improvements": ["Improvement 1", "Improvement 2"]
      }
      
      Rules:
      - Do NOT leave any field empty.
      - If no issues found, write "No major issues detected".
      - If no improvements found, suggest at least one best practice.
      - Keep answers short and clear.
      - Return ONLY valid JSON.
      - Do NOT include explanations outside JSON.
      
      

        Code:
        ${code}
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

  
  return raw;
}

export async function analyzeCodeCloud(code: string) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-coder",
        messages: [
          { role: "system", content: "You are a professional code analyzer." },
          { role: "user", content: code },
        ],
      }),
    },
  );

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function analyzeCode(code: string) {
  if (process.env.NODE_ENV === "development") {
    return analyzeCodeLocal(code);
  } else {
    return analyzeCodeCloud(code);
  }
}
