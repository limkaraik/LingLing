import React,{useState,useEffect} from "react";
import { Col, Card, Row,Space,DatePicker } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { Input } from "antd";
// import MEETINGS_DATA from "./MeetingHistoryData";
import bgImage from "./bg_image2.jpg";
import API from '../../Utils/baseUrl';
import {DateTime} from "luxon";

const { Search } = Input;
const { Meta } = Card;
const { RangePicker } = DatePicker;

function MeetingHistory(props) {

  const [Meetings, setMeetings] = useState([]);
  const [Filters, setFilters] = useState({});

  useEffect(()=>{
    handleAuth();
    getProducts({});
  },[])

  const handleAuth = ()=>{
      API.get('api/user/auth').then((res) => {
          const { success} = res.data;
          if (!success) {
            props.history.push('/login')
          }
      });
  }

  const getProducts = (variables)=>{
    API.post('/api/meeting/getAll',variables).then((res)=>{
        const {success,meetings} = res.data
        if (success){
          setMeetings(meetings)
        }
        else{
          alert("Failed to fetch meetings")
        }
    })
  }

  const handleFilters= (dates)=>{
    let variables = {date:dates}
    setFilters(variables)
    getProducts({filters:variables})
  }

  const handleSearch =(val)=>{
    let variables = {
      filers: Filters,
      searchTerm: val
    }
    getProducts(variables);

  }


  return (
    <div
      style={{
        width: "75%",
        margin: "1rem auto",
      }}
    >
      <h1>Meetings' History</h1>
      <br />
      <Space>
      <Search
        placeholder="Search"
        onSearch={handleSearch}
        enterButton
        style={{ width: 1000 }}
      />
      <RangePicker onChange={handleFilters}/>
      </Space>
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
              {Meetings.map(( meeting, index) => (
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
                    title={meeting.name}
                    description={DateTime.fromISO(meeting.date).setZone('UTC+8').toLocaleString(DateTime.DATETIME_MED) }
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
