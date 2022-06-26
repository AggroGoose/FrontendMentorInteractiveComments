import { IconDelete, IconEdit, IconReply } from "../../UI/Icons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";

import timeCalculator from "../../../app/timeCalculator";

export default function ResponseTop({ togEdit, item, users, userPost }) {
  const [dateOutput, setDateOutput] = useState("");
  const responder = users[item.user];

  useEffect(() => {
    const dateTime = timeCalculator(item.createdAt);
    dateTime ? setDateOutput(dateTime) : setDateOutput("Unknown Date");
  }, []);

  return (
    <div className="response__topdiv">
      <div className="response__topleft">
        <div className="response__image">
          {responder?.picture && (
            <Image
              src={responder.picture}
              width={30}
              height={30}
              style={{ borderRadius: "100%" }}
              alt={`A picture of author ${responder.display}`}
            />
          )}
        </div>
        <p className="response__user">
          {responder?.display ? responder.display : item.user}
        </p>
        <p className="response__date">{dateOutput}</p>
      </div>
      <div className="response__topright">
        {/* ==== These component functions are below ==== */}
        {userPost ? <ResponseTopEdit togEdit={togEdit} /> : <ResponseReply />}
      </div>
    </div>
  );
}

// ###############################################################
// ################# Reflexive Top Bar Functions #################
// ###############################################################

function ResponseReply() {
  return (
    <div className="response__topreply">
      <IconReply className="response__topreply--icon" />
      <p className="response__topreply--text">Reply</p>
    </div>
  );
}

function ResponseTopEdit({ togEdit }) {
  return (
    <div className="response__topedit">
      <div className="response__topedit--delete">
        <IconDelete className="response__topedit--deleteicon" />
        <p className="response__topedit--deletetext">Delete</p>
      </div>
      <div className="response__topedit--edit" onClick={togEdit}>
        <IconEdit className="response__topedit--editicon" />
        <p className="response__topedit--edittext">Edit</p>
      </div>
    </div>
  );
}
