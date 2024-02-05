/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {cleanUp, runPupWithContent, runPupWithUrl} from "./main";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const gander = onRequest({
  cors: ["http://localhost:1337", "https://web2pdf.syntaxpunk.com", /firebase\.com$/],
}, async (request, response) => {
  logger.info("-> pdfify: ", {structuredData: true});
  if (request.method !== "POST") {
    response.status(405).send("Method is not allowed");
    return;
  }

  if (request.body === undefined || (!request.body.url && !request.body.content)) {
    response.status(400).send("No data provided in the request");
    return;
  }

  const {url, content} = request.body;
  const tUrl = url ? url.trim() : "";
  const tContent = content ? content.trim() : "";

  let pdf: Buffer;
  if (tUrl && tUrl.length > 0) {
    pdf = await runPupWithUrl(tUrl);
  } else if (tContent && tContent.length > 0) {
    pdf = await runPupWithContent(tContent);
  } else {
    response.status(400).send("Wrong data provided");
    return;
  }

  response.status(200)
    .setHeader("Content-Disposition", "attachment; filename=document.pdf")
    .contentType("application/pdf")
    .send(pdf);

  await cleanUp();

  return;
});
