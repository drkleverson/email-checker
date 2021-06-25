import Telnet from "telnet-client";
import { promises } from "dns";

export default async (email: any) => {
  const domain = email.split("@")[1];
  let connection = new Telnet();
  const results = [];
  try {
    const mxResolved = await promises.resolveMx(domain);
    results.push({ "exchanges": mxResolved });

    let exchange = mxResolved.reduce((min, exchange) => {
      return min.priority < exchange.priority ? min : (min = exchange);
    });
    results.push({ "usedExchange": exchange });

    let params = {
      host: exchange.exchange,
      negotiationMandatory: false,
      port: 25,
      timeout: 30 * 1000,
    };

    await connection.connect(params);

  } catch (error) {
    return { "success":false,"data":error};
  }

  const helo = await connection.send(`EHLO Bubby`, {
    ors: "\r\n",
  });
  results.push({ "helo": helo });

  const mailFrom = await connection.send(`MAIL FROM: <${email}>`, {
    ors: "\r\n",
    waitfor: "\n",
  });
  results.push({ "mailFrom": mailFrom });
  
  const recepientTo = await connection.send(`RCPT TO: <${email}>`, {
    ors: "\r\n",
    waitfor: "\n",
  });
  results.push({ "recepientTo": recepientTo });

  await connection.destroy();
  return { "success":true,"data":results};
};
