import express, { json , Request, Response } from "express";
import emailCheck from './services/email-exists';

const app = express();

app.use(json());

app.disable("x-powered-by");


app.get("/:email", async (req: Request, res: Response) => {
    const { email } = req.params;
    const result = await emailCheck(email);
    res.send(result);
});

let port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
