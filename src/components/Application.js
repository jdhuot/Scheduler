import React, { useState, Fragment, useEffect } from "react";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from 'axios';

import "components/Application.scss";



const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "4pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "3pm",
    interview: {
      student: "Stu Sheppard",
      interviewer: {
        id: 2,
        name: "Tori Malcolm",
        avatar: "https://i.imgur.com/Nmx0Qxo.png",
      }
    }
  },
  {
    id: 4,
    time: "10am",
    interview: {
      student: "Kevin Malone",
      interviewer: {
        id: 3,
        name: "Mildred Nazir",
        avatar: "https://i.imgur.com/T2WwVfS.png",
      }
    }
  }
];


// let newArr = appointments.map((appt) => {return <Appointment key={appt.id} id={appt.id} time={appt.time} interview={appt.interview} />});


export default function Application(props) {
  // const [ day, setDay ] = useState("Monday");
  // const [ days, setDays ] = useState([]);
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });



  useEffect(() => {
    axios.get('/api/days')
    .then((res) => {
      setDays((prevDays) => {
        return res.data; 
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }, []);

  return (
    <main className="layout">
      <section className="sidebar"> 
        <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={days} day={day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        <Fragment>
          {appointments.map((appt) => {return <Appointment key={appt.id}{...appt} />})}
          <Appointment id="last" time="1pm" />
        </Fragment>
      </section>
    </main>
  );
}
