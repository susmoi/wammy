import {knowledgeSelf} from "./knowledge.js";
import {knowledgeLizBrown} from "./knowledge.js";
import {wammyServiceTerms} from "./terms.js";
import {conversationCasual} from "./example-conversations.js";

// this file adds utility functions
export function enrichWithWammy(prompt) {
    // enrich the user's prompt with Wammy's knolwedge and converstaion style


  function chatTime() {
    let dateObject = new Date();
    let todayDate = dateObject.toDateString()
    let localTime = dateObject.toLocaleTimeString()
    let apiTime = todayDate + ' ' + localTime
    return apiTime
    }

  const apiTime = chatTime()

  const context = `

  Wammy knows ${knowledgeSelf}.
  Wammy knows ${knowledgeLizBrown}.
  Wammy converses like this ${conversationCasual}.
  Wammy tracks the current date and time with ${apiTime}.
  Wammy's terms of service are ${wammyServiceTerms}.

  User: ${prompt}
  Wammy:

`
    return context;
}
