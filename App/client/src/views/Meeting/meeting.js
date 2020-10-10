import React from "react";
import { Typography, Row } from "antd";
import MEETINGS_DATA from "../MeetingHistory/MeetingHistoryData";
const { Title } = Typography;
const { Text } = Typography;

function Meeting() {
  return (
    <div style={{ width: "75%", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          border: "0.1rem solid black",
          backgroundColor: "white",
          height: "15vh",
          paddingTop: "1rem",
        }}
      >
        <Title level={10}>
          10 May Meeting
          <br />
          <h5 style={{ textAlign: "center" }}>Time: 08:10</h5>
        </Title>
      </div>

      <div style={{ display: "flex", height: "70vh", marginTop: "2rem" }}>
        <div
          style={{
            width: "50%",
            overflow: "scroll",
            overflowX: "hidden",
            margin: "0rem",
            padding: "2rem",
            border: "0.1rem solid black",
          }}
        >
          {MEETINGS_DATA[0].agenda.map((agenda, index) => {
            return (
              <Title level={5}>
                Agenda {index + 1}: {agenda}
              </Title>
            );
          })}
        </div>
        <div
          style={{
            width: "50%",
            margin: "0rem 0rem 0rem 1rem",
            overflow: "scroll",
            overflowX: "hidden",
            padding: "2rem",
            border: "0.1rem solid black",
          }}
        >
          <Title level={4}>Messages</Title>
          {MEETINGS_DATA[0].transcript.map((transcript, index) => {
            return (
              <Text>
                {transcript}
                <br />
              </Text>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Meeting;
