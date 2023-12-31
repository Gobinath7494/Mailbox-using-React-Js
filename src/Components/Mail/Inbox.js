import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { composeActions } from "../../store/compose-reducer";
import classes from "./Inbox.module.css";
import SingleMail from "./SingleMail";

const Inbox = () => {
  const mails = useSelector((state) => state.compose.fetchMail);
  const dispatch = useDispatch();

  const userMailId = localStorage.getItem("email");
  const userMail = userMailId.split(".").join("");

  const fetchMails = async () => {
    try {
      const res = await axios.get(
        // `https://mail-box-8d69e-default-rtdb.firebaseio.com/${userMail}Inbox.json`
        `https://mail-6c59f-default-rtdb.firebaseio.com/${userMail}Inbox.json`
      );
      console.log(res);
      dispatch(composeActions.fetchMail(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      fetchMails();
    }, 2000);
  }, []);

  const deleteHandler = async (mail) => {
    console.log(mail);
    try {
      const res = await axios.delete(
        // `https://mail-box-8d69e-default-rtdb.firebaseio.com/${userMail}Inbox/${mail}.json`
        `https://mail-6c59f-default-rtdb.firebaseio.com/${userMail}Inbox/${mail}.json`
      );
      console.log(res);
      fetchMails();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={classes.inbox}>
      <h1>Received Mails</h1>
      <div>
        <ul>
          {mails !== null &&
            Object.keys(mails).map((mail) => {
              let read = false;
              if (mails[mail].read !== false) {
                read = true;
              }
              return (
                <div key={mail.toString()}>
                  <div onClick={() => SingleMail(mail)}>
                    <li
                      style={{
                        listStyleType: read ? "none" : "disc",
                        color: read ? "black" : "blue",
                      }}
                    >
                      <span>From: {mails[mail].from}</span>
                    </li>
                  </div>
                  <button onClick={() => deleteHandler(mail)}>Delete</button>
                  <hr />
                </div>
              );
            })}
        </ul>
      </div>
    </section>
  );
};

export default Inbox;
