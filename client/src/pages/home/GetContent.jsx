import React from "react";
import { useSelector } from "react-redux";
import UserBloodRequests from "../request/UserBloodRequests";
import RequestList from "../request/RequestList";
import MatchedDonors from "../request/MatchedDonors";

const GetContent = () => {
  const { activeUserRole, activeTab } = useSelector(
    (state) => state.userReducer
  ); // 'donor' or 'seeker'

  const getContent = () => {
    if (activeUserRole === "donor") {
      if (activeTab === "requests") {
        return <RequestList />;
      } else {
        return <h1>No Donations Yet</h1>;
      }
    } else {
      // Seeker role
      if (activeTab === "myrequests") {
        return <UserBloodRequests />;
      } else {
        return <MatchedDonors />;
      }
    }
  };
  return <>{getContent()}</>;
};

export default GetContent;
