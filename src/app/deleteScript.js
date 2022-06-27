export default function deleteItems(id, type, replies, subreplies) {
  const deleteGroup = {
    comments: [],
    replies: [],
    subreplies: [],
  };

  console.log(id, type, replies, subreplies);
  console.log("Checking: ", type === "subreply");

  if (type == "subreply") {
    deleteGroup.subreplies.push(id);

    return deleteGroup;
  }

  if (type == "reply") {
    deleteGroup.replies.push(id);
    subreplies.forEach((sub) => {
      if (sub.forReply === id) {
        deleteGroup.subreplies.push(sub.id);
      }
    });
    return deleteGroup;
  }

  if (type == "comment") {
    deleteGroup.comments.push(id);
    replies.forEach((rep) => {
      if (rep.forComment === id) {
        deleteGroup.replies.push(rep.id);
        subreplies.forEach((sub) => {
          if (sub.forReply === rep.id) {
            deleteGroup.subreplies.push(sub.id);
          }
        });
      }
    });
    return deleteGroup;
  }
}
