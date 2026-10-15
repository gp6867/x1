import MessageActions from "./MessageActions";

export default function MessageBubble({message}:any){

  return(
    <div className={message.role==="user"?"user":"ai"}>
      <p>{message.content}</p>

      {message.role==="assistant" &&
        <MessageActions text={message.content}/>
      }
    </div>
  );
}
