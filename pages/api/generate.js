export default async function handler(req, res) {
  const { resume, job } = req.body;

  const type = req.body.type || 'cover';

const prompts = {
  cover: "Write a professional cover letter based on the following resume and job description.",
  linkedin: "Write a friendly, brief LinkedIn message to connect with someone professionally.",
  resignation: "Write a polite and professional resignation letter based on the employee’s role and reason.",
  thankyou: "Write a thank-you note after a job interview for the given role.",
};

const prompt = prompts[type] || prompts['cover'];


  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const letter = data.choices[0].text.trim();
    res.status(200).json({ letter });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: "Failed to generate letter" });
  }
}
