
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const analyzeReport = async (req, res) => {
  try {
    const content = req.body.text;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Analyze the medical report: ${content}`,
      max_tokens: 1000,
    });
    res.json({ analysis: response.data.choices[0].text });
  } catch (error) {
    console.error("Analysis failed:", error.message);
    res.status(500).send("Analysis failed");
  }
};

module.exports = { analyzeReport };
