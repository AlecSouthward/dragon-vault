export default async function (fastify) {
  fastify.post('/login', async (req, res) => {
    let responseMessage;
    let usernameValid;

    const { username } = req.body;

    if (!username) {
      usernameValid = false;
      responseMessage = "Invalid username";

      res.code(400);
    } else {
      usernameValid = true;
      responseMessage = "Username is valid";
    }

    return {
        message: responseMessage,
        valid: usernameValid
    };
  });

  fastify.post("/create", async (req, res) => {
    const { username } = req.body;

    const userId = Date.now().toString(36) + Math.random().toString(36).slice(2);

    return {
      id: userId
    };
  });
}