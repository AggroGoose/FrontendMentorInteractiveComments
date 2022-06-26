import ItemList from "./ItemList";
import ResponseMain from "./MainContent/ResponseContainer";
import VoteModule from "./VoteModule";

export default function ResponseItem({ index, users, format, id }) {
  return (
    <div className="response">
      <div className={`card response__container size-${format}`}>
        <VoteModule format={format} index={index} />
        <ResponseMain users={users} index={index} format={format} />
      </div>
      {format === "comment" && (
        <ItemList format="comment" id={id} users={users} />
      )}
      {format === "reply" && <ItemList format="reply" id={id} users={users} />}
    </div>
  );
}
