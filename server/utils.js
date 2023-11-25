import {knowledgeSelf} from "./knowledge.js";
import {knowledgeLizBrown} from "./knowledge.js";
import {conversationCasual} from "./example-conversations.js";

// this file adds utility functions
export function enrichWithWammy(prompt) {
    // enrich the user's prompt with Wammy's knolwedge and converstaion style

  const context = `

  This is what wammy knows about itself ${knowledgeSelf}.
  This is what wammy knows about Liz Brown ${knowledgeLizBrown}.
  This is how Wammy talks ${conversationCasual}.

  User: ${prompt}
  Wammy:

`
    return context;
}
