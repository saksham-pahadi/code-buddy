export async function analyzeCodeFile(structure:string,file: { reponame: string, path: string, code: string }) {

  const prompt = `
You are analyzing ONE file from a larger GitHub repository.
Structure of the repository is as follows:
${structure}
File Path:
${file.path}

Return ONLY JSON.

{
 "code_explaination": "",
 "time_complexity": "",
 "space_complexity": "",
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
${file.code}
`
// console.log("3 Analyzing file-->", file);

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
  // console.log("Raw response from Analyzing file:", data.choices[0].message.content);

  return data.choices[0].message.content
}catch(err){
  console.error("Error in code analysis:", err);
  return { done: true,error: true };
}
}


export async function summarizeCodeRepo(results: string) {
// console.log("4 Summarizing repository based on file analyses-->", results);
  const prompt = `
you have to summarize the analysis of a github repository in one report based on the analysis of its individual files.

The analysis of individual files is as follows:
${results}
and mention file names in time_complexity, space_complexity, bugs&errors, optimizations fields if it belongs to a specific file.

Return ONLY JSON.

{
 "title": "presize title here",
 "code_explaination": "2-3 line summary",
 "time_complexity": "O(n): short reason",
 "space_complexity": "O(n): short reason",
 "Bug&Error": ["issue1 in file1, "issue2 in file2"],
 "optimization": ["optimization1 in file1, "optimization2 in file2"],
 "scores": {
   "readability": 0,
   "maintainability": 0,
   "performance": 0,
   "security": 0
 }
}
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
  // console.log("Raw response from summarizing repository:", data.choices[0].message.content);

  return data.choices[0].message.content
}catch(err){
  console.error("Error in summarizeCodeRepo:", err);
  return { done: true,error: true };
}
}

export async function analyzeCodeRepo(structure:string,file: [{ reponame: string, path: string, code: string }]) {
    // console.log("2 Starting repository analysis with structure -->", structure);
    // console.log("2 Starting repository analysis with files -->", file);
     const analysisResults = await Promise.all(
    file.map(async (f) => {

      const result = await analyzeCodeFile(
        structure,
        f
      );

      return {
        file: f.path,
        analysis: result,
      };
    })
  );

  // console.log("All file analyses completed");


    

    let summarizedResults =await summarizeCodeRepo(JSON.stringify(analysisResults));
    return summarizedResults;
}




