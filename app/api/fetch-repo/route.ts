
export async function POST(req: Request) {
    const { Owner } = await req.json();
  try {
     const response = await fetch(
        `https://api.github.com/users/${Owner}/repos`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
          method: "GET",
        },
      );
      const data = await response.json();
    //   console.log("Fetched repositories:", data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });


  } catch (err) {
    console.log(
        `Failed to fetch repositories for user "${Owner}". Please check the GitHub username and try again.`,
      );
      console.log("Error fetching repository data:", err);
  }
}