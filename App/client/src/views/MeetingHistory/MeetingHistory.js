import React from "react";
import { Col, Card, Row } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { Input } from "antd";
import MEETINGS_DATA from "./MeetingHistoryData";
import bgImage from "./bg_image2.jpg";

const { Search } = Input;
const { Meta } = Card;

function MeetingHistory() {
  return (
    <div
      style={{
        width: "75%",
        margin: "1rem auto",
      }}
    >
      <h1>Meetings' History</h1>
      <br />

      <Search
        placeholder="Search"
        onSearch={(value) => console.log(value)}
        enterButton
      />
      <br />

      <div
        style={{
          margin: "3rem auto",
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <Row gutter={[40, 40]}>
          <Col lg={24} md={24} xs={24}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                margin: "3rem 1.5rem",
                justifyContent: "center",
                alignContent: "center",
                opacity: "0.75",
              }}
            >
              {MEETINGS_DATA.map(({ id, ...otherCollectionProps }, index) => (
                <Card
                  style={{ margin: "1rem" }}
                  cover={
                    <a
                      href={"/Meeting"}
                      style={{
                        backgroundColor: "grey",
                      }}
                    >
                      <ReadOutlined
                        style={{
                          fontSize: 20,
                          color: "black",
                          margin: "0.2rem",
                        }}
                      />
                    </a>
                  }
                >
                  <Meta
                    style={{ textAlign: "center" }}
                    title={MEETINGS_DATA[index].title}
                    description={MEETINGS_DATA[index].description}
                  />
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default MeetingHistory;
